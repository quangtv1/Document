var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheetsCount = ss.getNumSheets();
var sheets = ss.getSheets();
var ui = SpreadsheetApp.getUi();

function onOpen() { 
// Try New Google Sheets method    
    ui.createMenu('Phòng TT&TT')
    .addItem('Tạo hàng loạt File Google Sheet', 'taoFileGgSheets')
    .addItem('Giới hạn quyền ghi các Trường', 'setQuyenHangLoat')
    //.addItem('Delete All Sheets', 'deleteAllSheets')
    //.addItem('Copy Sheets', 'copySheets')      
    //.addItem('Tạo Multi sheets có Tên', 'rosterTabs') //(caption, function name)
    //.addItem('Run ListToTabs', 'listToTabs')  
    //.addSeparator()
    //.addItem('About', 'aboutFile')
    .addToUi();
}   

var ID_FOLDER_BOMON = 'https://drive.google.com/drive/folders/1DwgJn0lv8BQEGss96UlW6bTfidsjH4F5';

// Tạo mới file từ danh sách các bộ môn ở Sheet Danh sách bộ môn và cho vào trong idFolder


function getIdFrom(url) {
    try {
        var id = "";
        var parts = url.split(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
        if (url.indexOf('?id=') >= 0) {
            id = (parts[6].split("=")[1]).replace("&usp", "");
            return id;
        } else {
            id = parts[5].split("/");
            //Using sort to get the id as it is the longest element. 
            var sortArr = id.sort(function(a, b) { return b.length - a.length });
            id = sortArr[0];
            return id;
        }
    } catch (err) {
        ui.alert('Xảy ra lỗi, hãy kiểm tra lại URL của bạn !' + err);
    }
}


function queryGetData(tenDonVi) {

    // Nhồi Data vào biến tạm, clipboad, cache => Ko biết bộ nhớ tạm của Google gọi là gì ?
    var idSpr = '1aALcJTbOiKrEJpbiUocMjMrWS3IcWdCYhKw1EpkD-Rc'; // Id file chứa data
    var rangeData = "Data!A:S"; // Sheet trường chứa dữ liệu
    var importRan = 'IMPORTRANGE(\"' + idSpr + '\",\"' + rangeData + '\")'; // Hàm IMPORTRANGE

    // Lọc dữ liệu cột 08 là cột chứa tên Bộ môn
    var colFilter = 'Col8';
    var select = '\"SELECT * WHERE ' + colFilter + '=\'' + tenDonVi + '\'\"';

    // Trả về dữ liệu
    return '\=QUERY(' + importRan + ',' + select + ',1)'; // Số 1 là bỏ qua một Row header

    /* 
       Dữ liệu mong muốn trả về: =QUERY(IMPORTRANGE("1aALcJTbOiKrEJpbiUocMjMrWS3IcWdCYhKw1EpkD-Rc","Data!$A$1:$S$945"),"SELECT * WHERE Col8='BM Cảng - Đường thuỷ'",1)
       Tham khảo thêm Document tại: https://developers.google.com/chart/interactive/docs/querylanguage
    */
}


function taoFileGgSheets() {
   
    var url = Browser.inputBox("Dán URL thư mục muốn tạo các file vào đây !\\n .\\n");    
    var idThuMuc = getIdFrom(url);      
    var tenSheetDsFile = Browser.inputBox("Gõ tên SHEET chứa TÊN các file cần tạo \\n (ví dụ: Sheet1 hoặc Danh sách...) \\n .\\n");   
           
    var folder = DriveApp.getFolderById(idThuMuc);    
    var sheetDS = ss.getSheetByName(tenSheetDsFile);   
    var range = sheetDS.getDataRange();    
    var values = range.getValues();
    var lastRow = range.getLastRow();
    
    for (var k = 1; k < lastRow; k++) {
    try {
            // Lấy tên file cần tạo ở cột A
            var tenFile = values[k][0];
            sheetDS.getRange(k+1, 1).setBackground('#b6d7a8'); //Set màu sau khi lấy
            ss = SpreadsheetApp.create(tenFile);
      
            // Ghi Id file mới tạo vào Cột B
            var id = ss.getId();
            range.getCell(k + 1, 2).setValue(id);

            // Thêm file mới tạo vào Folder có link là đầu vào
            var file = DriveApp.getFileById(id);
            folder.addFile(file);
      
            // Gán link file cột D
            var ganLinkTenFile = '=HYPERLINK("' + file.getUrl() +'","'+ tenFile + '")';  
            range.getCell(k + 1, 1).setFormula(ganLinkTenFile);                  

            // Lấy hàm query get dữ liệu
            //var query = range.getCell(k + 1, ).getValue(); //Lấy hàm query ở cột 3   
                 
            // XỬ LÝ FILE MỚI TẠO
            var ssBomon = SpreadsheetApp.openById(id);
            var sheetBomon = ssBomon.getSheetByName('Sheet1');
            var rangeBomon = sheetBomon.getDataRange();

            // Get data với bộ lọc Filter Bộ môn
            var query = queryGetData(tenFile);
            rangeBomon.getCell(1, 1).setValue(query);
            
            // Trình bày file mới tạo
            var kichThuoc = trinhBaySheet(id);   
                  
            range.getCell(k + 1, 3).setValue(kichThuoc);
            

            // Ko lấy ra được vì hàm query chưa điền nội dung
            //var soCanbo = rangeBomon.getLastRow();
            //var soTruongThongtin =rangeBomon.getLastColumn();
            //range.getCell(soCanbo, soTruongThongtin).setBorder(true, true, true, true, true, true);
        } catch (err) {
          ui.alert('Xảy ra lỗi, hãy kiểm tra lại  \\n' + err);
        } 
    } 
    var thongBao = 'Đã tạo xong: '+ (k-1) +' file trong thư mục: ' + folder.getName();    
    ui.alert(thongBao);
}

function chayThu() {
  //var idSheet = '1SwfknqGvcqn5s2NZzMI5za403ru8z60PEjoyegfy5MA';
  //trinhBaySheet(idSheet);
  //setQuyenSheet(idSheet);
  //var str = queryGetData('Phòng TT&TT');
  //Logger.log(str);
  
  var linkFile = 'https://docs.google.com/spreadsheets/d/1dEN1iL2VfxmiSzJSLpAbKf_wDFq3ZRpkF98jw5pr464/edit#gid=0';
  var tenFile = 'BM Cảng - Đường thuỷ';
  setQuyenSheet('1Tr8AbyHqsWd6CMnfdUZmqROFUXIIJ4u75df-cYVDn_s');
}


function setQuyenHangLoat() {

    var tenSheetDsFile = Browser.inputBox("Gõ tên SHEET chứa chứa ID nằm ở cột B, \\n (ví dụ: Sheet1 hoặc DS...) \\n ");
    var sheetDS = ss.getSheetByName(tenSheetDsFile);
    //var sheetDS = ss.getSheetByName('DS');
    var range = sheetDS.getDataRange();
    var lastRow = range.getLastRow();

    for (var k = 2; k <= lastRow; k++) {
        try {
            // Lấy tên file cần tạo ở cột A
            var tenFile = sheetDS.getRange(k, 1).getValue();
            var idSheet = sheetDS.getRange(k, 2).getValue();
            var kichThuoc = sheetDS.getRange(k, 3).getValue();
            var email = sheetDS.getRange(k, 4).getValue();

            Logger.log(idSheet + '-' + email);
            setQuyenSheet(idSheet,email);          

        } catch (err) {
            ui.alert('Xảy ra lỗi, hãy kiểm tra lại  \\n' + err);
        }
     }
     ui.alert('Đã giới hạn xong quyền edit cho: ' + (lastRow-1) + ' file');
}

function setQuyenSheet(idSheet,email) {
  
    var fileGgSheetBomon = DriveApp.getFileById(idSheet);
    fileGgSheetBomon.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    //Logger.log(fileGgSheetBomon.getUrl());   

  
    // Protect the active sheet except colored cells, then remove all other users from the list of editors.
    var ssBomon = SpreadsheetApp.openById(idSheet);
    var sheetBomon = ssBomon.getSheetByName('Sheet1'); 
    var rangeBomon = sheetBomon.getDataRange();
  
    // Xóa tất cả các range đã bảo vệ
    var protections = sheetBomon.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    for (var i = 0; i < protections.length; i++) {
        var protection = protections[i];
        if (protection.canEdit()) {
            protection.remove();
        }
     }
  
    var range = sheetBomon.getRange(1, 1, 900, 12); //A-L    
    var range1 = sheetBomon.getRange(1, 15, 900,4 ); //O-R
  
    var rangeDienThoai = sheetBomon.getRange(1, 13, 900, 2 ); //M-N
    var rangeTrangThai = sheetBomon.getRange(1,19, 900, 1 ); //S
  
    var date = Utilities.formatDate(new Date(), "GMT+7", "HH:mm:ss', 'dd/MM/yyyy ");  
    var protection = range.protect().setDescription('Protect cột A - cột L: (' + date +')');  
    var protection1 = range1.protect().setDescription('Protect cột O - cột R : (' + date +')');
  
    var protectionDienThoai = rangeDienThoai.protect().setDescription('Protect cột M - cột N: (' + date +')');  
    var protectionTrangThai = rangeTrangThai.protect().setDescription('Protect cột S : (' + date +')');

  
    var me = Session.getEffectiveUser();
    fileGgSheetBomon.setOwner(me);
    protection.addEditor(me);
    protection1.addEditor(me);     
    
    // Chỉ cho email sửa cột Điện thoại, Phòng làm việc, Trạng thái update    
    protectionDienThoai.addEditor(email);
    protectionTrangThai.addEditor(email);
  
    //fileGgSheetBomon.addEditor(email);
    //fileGgSheetBomon.addViewer(email);
    fileGgSheetBomon.addEditor(email); //CHÚ Ý VỊ TRÍ ĐẶT HÀM

}



function trinhBaySheet(id) {    
    var idCuaSheet = id;    
    //var idCuaSheet = '1t6_xb8FY5dvb7q1a13YWwCfAi9JZW9bvZETbC2tuRLU'; 
    var ssBomon = SpreadsheetApp.openById(idCuaSheet);
    var sheetBomon = ssBomon.getSheetByName('Sheet1');
    var rangeBomon = sheetBomon.getDataRange();
    var soHang = rangeBomon.getLastRow();
    var soCot = rangeBomon.getLastColumn();    
    
    // Copy dữ liệu sang range mới để xóa hàm Query tại A1
    var rangeMoi = sheetBomon.getRange(soHang+1, 1, soHang, soCot); 
    sheetBomon.getRange(1, 1, soHang, soCot).copyTo(rangeMoi, {contentsOnly:true})
    
    // Xóa hàng
    sheetBomon.deleteRows(1, soHang);   
      
    
    // SET MÀU HÀNG ĐẦU, CÂN GIỮA, WRAP, BORDER, CANH MIDDLE    
    sheetBomon.getRange(1, 1, soHang, soCot).setHorizontalAlignment('left'); //Set cân bên trái tất cả về Default 
    sheetBomon.autoResizeRows(1, soHang);  //Auto độ rộng all hàng    
    sheetBomon.getRange(1, 1, 1, soCot).setBackground('#FECB8D');  //Set màu nền Vàng cam cho hàng Tiêu đề.    
    sheetBomon.getRange(1, 1, 1, soCot).setFontWeight("bold");  //Set Font chữ in đậm hàng đầu tiên    
    sheetBomon.getRange(1, 1, 1, soCot).setWrap(true); //Set hàng đầu tiên Wrap    
    sheetBomon.getRange(1, 1, 1, soCot).setHorizontalAlignment('center'); //Set cân giữa cho hàng đầu tiên    
    sheetBomon.getRange(1, 1, soHang, soCot).setBorder(true, true, true, true, true, true);  //Set Border cho tất cả các cell    
    sheetBomon.getRange(1, 1, soHang, soCot).setVerticalAlignment('middle');  //Canh middle cho tất cả các cell    
    sheetBomon.getRange(2, 13, soHang-1, 2).setBackground('#b6d7a8');
    sheetBomon.getRange(2, 19, soHang-1, 1).setBackground('#b6d7a8');
    
    // SET ĐỘ RỘNG BẰNG TAY CHO CÁC CỘT ĐỂ NHÌN HỢP LÝ
    sheetBomon.setColumnWidth(1, 50);  // Mã số CB
    sheetBomon.setColumnWidth(2, 70);  // Học hàm học vị
    sheetBomon.setColumnWidth(3, 100);  // Họ đệm 
    sheetBomon.setColumnWidth(4, 60);  // Tên
    sheetBomon.setColumnWidth(5, 80);  // Năm sinh
    sheetBomon.setColumnWidth(6, 150);  // Quê quán
    sheetBomon.setColumnWidth(7, 50);  // Giới tính
    sheetBomon.autoResizeColumns(8,9); // Auto Bộ môn, Đơn vị, Email, Quang check, User ID, Điện thoại
    sheetBomon.setColumnWidth(10, 140);  // Email
    sheetBomon.autoResizeColumns(11,13); // Auto Quang check, User ID, Điện thoại
    sheetBomon.setColumnWidth(14, 70);  // Phòng làm việc
    sheetBomon.setColumnWidths(15, 4, 90); // Set cột 15 đến 18
    sheetBomon.setColumnWidths(19, 1, 150); // Set cột 19
    sheetBomon.getRange(1, 1, soHang, 2).setHorizontalAlignment('center');  //Set cân giữa hai cột đầu tiên
    
    // Set date format
    var colNamsinh = sheetBomon.getRange(5,5,100); // 100 thay cho soHang ?
    colNamsinh.setNumberFormat('dd/mm/yyyy');
    
    // ẨN CÁC CỘT KHÔNG CẦN NHÌN
    var col9 = sheetBomon.getRange(9,9,soHang);  // Cột Đơn vị
    sheetBomon.hideColumns(6, 2); // Ẩn cột 6, 7: Quê quán, Giới tính 
    sheetBomon.hideColumn(col9); // Ẩn Cột Đơn vị
    sheetBomon.hideColumns(11, 2); // Ẩn cột 11, 12: Cột trùng email; UserID
    sheetBomon.hideColumns(17, 2); // Ẩn cột 17, 18: GV SDH, Học lên
  
    
    return soHang+'x'+soCot;
  
}

// alert if no sheets matched the user input
function noMatchAlert() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.alert(
   'Trường dữ liệu bạn gõ vào ko đúng \\n',
   "Kiểm tra lại cho chính xác nhé ok ?",
   ui.ButtonSet.OK);
}

// alert after succesful action (only used in copy)
function successAlert(action) {
  var ui = SpreadsheetApp.getUi();
  var result = ui.alert(
   'Thành công !\\n',
   "You're sheets were " + action + " successfully.",
    ui.ButtonSet.OK);
}
