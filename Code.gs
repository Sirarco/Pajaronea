/**
 * ============================================================================
 * PAJARONEA - BACKEND GOOGLE APPS SCRIPT (GAS)
 * ============================================================================
 * Proyecto de Bitácora y Guía de Aves de Chile a Costo Cero
 * Autor: Code x VINI (marco.lara.vera@gmail.com)
 *
 * Este script se vincula a una hoja de cálculo (Google Sheet) y a una carpeta
 * en Google Drive para gestionar de forma 100% gratuita:
 *  1. Autenticación de usuarios por contraseña.
 *  2. Registro y desmarcado de avistamientos con fecha y hora.
 *  3. Almacenamiento de fotografías capturadas desde la cámara o dispositivo.
 * ============================================================================
 */

// Nombre de la carpeta en Google Drive donde se guardarán las fotos
var FOLDER_NAME = "Pajaronea_Fotos_Avistamientos";
var SHEET_USERS = "Usuarios";
var SHEET_SIGHTINGS = "Avistamientos";

/**
 * Función de configuración inicial automática.
 * Ejecútala una vez desde el editor de Apps Script si deseas poblar datos de prueba.
 */
function setupInitialSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Hoja de Usuarios
  var sheetUsers = ss.getSheetByName(SHEET_USERS);
  if (!sheetUsers) {
    sheetUsers = ss.insertSheet(SHEET_USERS);
    sheetUsers.appendRow(["Usuario", "Password", "FechaCreacion", "Rol"]);
    sheetUsers.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#FFEBF0");
    // Usuario inicial de ejemplo
    sheetUsers.appendRow(["Marco", "pajareo2024", new Date().toISOString(), "Observador"]);
    sheetUsers.appendRow(["Pajarero RM", "aves2026", new Date().toISOString(), "Observador"]);
  }
  
  // 2. Hoja de Avistamientos
  var sheetSightings = ss.getSheetByName(SHEET_SIGHTINGS);
  if (!sheetSightings) {
    sheetSightings = ss.insertSheet(SHEET_SIGHTINGS);
    sheetSightings.appendRow([
      "ID",
      "Usuario",
      "IdAve",
      "NombreAve",
      "FechaHora",
      "UrlFotoDrive",
      "IdArchivoDrive",
      "Notas",
      "Estado"
    ]);
    sheetSightings.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#E4DCFA");
  }
  
  // 3. Crear/obtener carpeta en Drive con permisos de lectura pública
  getOrCreateDriveFolder();
  
  Logger.log("Configuración inicial completada con éxito.");
}

/**
 * Obtiene o crea la carpeta pública en Google Drive.
 */
function getOrCreateDriveFolder() {
  var folders = DriveApp.getFoldersByName(FOLDER_NAME);
  var folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(FOLDER_NAME);
  }
  // Permitir que cualquiera con el enlace pueda ver las fotos subidas
  try {
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {
    Logger.log("Nota sobre permisos de carpeta: " + err.message);
  }
  return folder;
}

/**
 * Manejo de peticiones GET (para verificación y soporte JSONP)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "ping";
  var response = {};

  try {
    if (action === "ping") {
      response = { status: "ok", message: "Pajaronea GAS API funcionando correctamente 🐦" };
    } else if (action === "login") {
      response = handleLogin(e.parameter.password);
    } else if (action === "getSightings") {
      response = handleGetSightings(e.parameter.user);
    } else {
      response = { success: false, error: "Acción no reconocida vía GET" };
    }
  } catch (error) {
    response = { success: false, error: error.toString() };
  }

  // Soporte de callback JSONP si se requiere
  if (e && e.parameter && e.parameter.callback) {
    return ContentService
      .createTextOutput(e.parameter.callback + "(" + JSON.stringify(response) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Manejo de peticiones POST (registro, fotos, desmarcado, login seguro)
 */
function doPost(e) {
  var response = {};
  
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var action = data.action;

    if (action === "login") {
      response = handleLogin(data.password);
    } else if (action === "getSightings") {
      response = handleGetSightings(data.user);
    } else if (action === "addSighting") {
      response = handleAddSighting(data);
    } else if (action === "removeSighting") {
      response = handleRemoveSighting(data.user, data.birdId);
    } else if (action === "uploadPhoto") {
      response = handleUploadPhoto(data);
    } else {
      response = { success: false, error: "Acción POST no reconocida: " + action };
    }
  } catch (error) {
    response = { success: false, error: error.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 1. Autenticación por contraseña en la hoja 'Usuarios'
 */
function handleLogin(password) {
  if (!password) {
    return { success: false, error: "Debes ingresar una contraseña." };
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_USERS);
  if (!sheet) {
    setupInitialSheets();
    sheet = ss.getSheetByName(SHEET_USERS);
  }
  
  var data = sheet.getDataRange().getValues();
  // Fila 0 son encabezados: [Usuario, Password, ...]
  for (var i = 1; i < data.length; i++) {
    var user = String(data[i][0]).trim();
    var pass = String(data[i][1]).trim();
    if (pass === String(password).trim()) {
      return {
        success: true,
        user: user,
        message: "Bienvenido a Pajaronea"
      };
    }
  }
  
  return { success: false, error: "Contraseña incorrecta. Verifica en la hoja Usuarios." };
}

/**
 * 2. Obtener lista de avistamientos para un usuario
 */
function handleGetSightings(user) {
  if (!user) {
    return { success: false, error: "Usuario no especificado" };
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_SIGHTINGS);
  if (!sheet) {
    setupInitialSheets();
    sheet = ss.getSheetByName(SHEET_SIGHTINGS);
  }
  
  var data = sheet.getDataRange().getValues();
  var sightings = [];
  
  // Encabezados: [ID, Usuario, IdAve, NombreAve, FechaHora, UrlFotoDrive, IdArchivoDrive, Notas, Estado]
  for (var i = 1; i < data.length; i++) {
    var rowUser = String(data[i][1]).trim();
    var status = String(data[i][8]).trim();
    if (rowUser.toLowerCase() === user.toLowerCase() && status.toLowerCase() === "activo") {
      sightings.push({
        id: data[i][0],
        idAve: data[i][2],
        nombreAve: data[i][3],
        fechaHora: data[i][4],
        urlFotoDrive: data[i][5],
        notas: data[i][7]
      });
    }
  }
  
  return { success: true, sightings: sightings };
}

/**
 * 3. Registrar nuevo avistamiento (con o sin foto en base64)
 */
function handleAddSighting(payload) {
  var user = payload.user;
  var birdId = payload.birdId;
  var birdName = payload.birdName || birdId;
  var notes = payload.notes || "Avistamiento registrado desde Pajaronea Web";
  var imageBase64 = payload.imageBase64; // "data:image/jpeg;base64,..."
  
  if (!user || !birdId) {
    return { success: false, error: "Faltan datos obligatorios (user o birdId)" };
  }
  
  var photoUrl = "";
  var driveFileId = "";
  
  // Guardar imagen en Google Drive si viene adjunta
  if (imageBase64 && imageBase64.indexOf("base64,") !== -1) {
    try {
      var folder = getOrCreateDriveFolder();
      var contentType = imageBase64.substring(imageBase64.indexOf(":") + 1, imageBase64.indexOf(";"));
      var base64Data = imageBase64.substring(imageBase64.indexOf("base64,") + 7);
      var decodedBytes = Utilities.base64Decode(base64Data);
      var extension = contentType.indexOf("png") !== -1 ? ".png" : ".jpg";
      var filename = "Pajaronea_" + user + "_" + birdId + "_" + Utilities.formatDate(new Date(), "GMT-3", "yyyyMMdd_HHmmss") + extension;
      
      var blob = Utilities.newBlob(decodedBytes, contentType, filename);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      driveFileId = file.getId();
      // Formato directo de visualización web de Google Drive
      photoUrl = "https://lh3.googleusercontent.com/d/" + driveFileId;
    } catch (imgErr) {
      Logger.log("Error guardando imagen en Drive: " + imgErr.message);
    }
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_SIGHTINGS);
  if (!sheet) {
    setupInitialSheets();
    sheet = ss.getSheetByName(SHEET_SIGHTINGS);
  }
  
  var dateStr = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy HH:mm:ss");
  var sightingId = "SIGHT_" + new Date().getTime();
  
  // Si ya existía un registro activo previo para esta ave y este usuario, actualizarlo
  var data = sheet.getDataRange().getValues();
  var foundRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === user.toLowerCase() && 
        String(data[i][2]).toLowerCase() === birdId.toLowerCase()) {
      foundRow = i + 1;
      break;
    }
  }
  
  if (foundRow > 0) {
    // Actualizar registro existente
    sheet.getRange(foundRow, 4).setValue(birdName);
    sheet.getRange(foundRow, 5).setValue(dateStr);
    if (photoUrl) {
      sheet.getRange(foundRow, 6).setValue(photoUrl);
      sheet.getRange(foundRow, 7).setValue(driveFileId);
    }
    sheet.getRange(foundRow, 8).setValue(notes);
    sheet.getRange(foundRow, 9).setValue("Activo");
  } else {
    // Insertar nueva fila
    sheet.appendRow([
      sightingId,
      user,
      birdId,
      birdName,
      dateStr,
      photoUrl,
      driveFileId,
      notes,
      "Activo"
    ]);
  }
  
  return {
    success: true,
    sighting: {
      id: sightingId,
      idAve: birdId,
      nombreAve: birdName,
      fechaHora: dateStr,
      urlFotoDrive: photoUrl,
      notas: notes
    }
  };
}

/**
 * 4. Desmarcar avistamiento
 */
function handleRemoveSighting(user, birdId) {
  if (!user || !birdId) {
    return { success: false, error: "Datos incompletos para desmarcar" };
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_SIGHTINGS);
  if (!sheet) return { success: true };
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === user.toLowerCase() && 
        String(data[i][2]).toLowerCase() === birdId.toLowerCase() &&
        String(data[i][8]).toLowerCase() === "activo") {
      // Marcar como inactivo para trazabilidad histórica
      sheet.getRange(i + 1, 9).setValue("Inactivo");
      return { success: true, message: "Avistamiento desmarcado" };
    }
  }
  
  return { success: true, message: "No había avistamiento activo previo" };
}

/**
 * 5. Subir o actualizar fotografía de un ave
 */
function handleUploadPhoto(payload) {
  var user = payload.user;
  var birdId = payload.birdId;
  var imageBase64 = payload.imageBase64;
  
  if (!user || !birdId || !imageBase64) {
    return { success: false, error: "Falta usuario, ave o imagen base64" };
  }
  
  var folder = getOrCreateDriveFolder();
  var contentType = imageBase64.substring(imageBase64.indexOf(":") + 1, imageBase64.indexOf(";"));
  var base64Data = imageBase64.substring(imageBase64.indexOf("base64,") + 7);
  var decodedBytes = Utilities.base64Decode(base64Data);
  var extension = contentType.indexOf("png") !== -1 ? ".png" : ".jpg";
  var filename = "Pajaronea_" + user + "_" + birdId + "_" + Utilities.formatDate(new Date(), "GMT-3", "yyyyMMdd_HHmmss") + extension;
  
  var blob = Utilities.newBlob(decodedBytes, contentType, filename);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  var driveFileId = file.getId();
  var photoUrl = "https://lh3.googleusercontent.com/d/" + driveFileId;
  
  // Actualizar en hoja
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_SIGHTINGS);
  if (sheet) {
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]).toLowerCase() === user.toLowerCase() && 
          String(data[i][2]).toLowerCase() === birdId.toLowerCase() &&
          String(data[i][8]).toLowerCase() === "activo") {
        sheet.getRange(i + 1, 6).setValue(photoUrl);
        sheet.getRange(i + 1, 7).setValue(driveFileId);
        break;
      }
    }
  }
  
  return {
    success: true,
    photoUrl: photoUrl,
    driveFileId: driveFileId
  };
}
