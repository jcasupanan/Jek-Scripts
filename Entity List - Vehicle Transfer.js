$(document).ready(function() {
  $(document).trigger("createFilter", [[["gsc_transferdate", "Transfer Date"]]]);
  $(document).trigger("enableBulkDelete");
  //Cancel Button
  var cancelIcon = DMS.Helpers.CreateFontAwesomeIcon('fa-ban');
  var cancelBtn = DMS.Helpers.CreateButton('button', 'btn btn-primary cancel', '', ' CANCEL', cancelIcon);
  DMS.Helpers.AppendButtonToToolbar(cancelBtn);
  //Post Button
  var postIcon = DMS.Helpers.CreateFontAwesomeIcon('fa-thumb-tack');
  var postBtn = DMS.Helpers.CreateButton('button', 'btn btn-primary post', '', ' POST', postIcon);
  DMS.Helpers.AppendButtonToToolbar(postBtn);
  
  //Functions
  var cancel = '100000002'
var posted = '100000000'

var recordArr = [];

cancelBtn.click(function (){
var that = $(this);
var html = that.html();	
recordArr = GetModelForSelectedRecords(cancel);	
if (recordArr.length > 0) {
            that.html('<i class="fa fa-spinner fa-spin"></i>&nbsp;PROCESSING..');
            that.addClass('disabled');

            var url = "/api/EditableGrid/UpdateRecords";
            var json = JSON.stringify(recordArr);
            var service = Service('PUT', url, json, DMS.Helpers.DefaultErrorHandler);

            service.then(function () {
                DMS.Helpers.RefreshEntityList();
                DMS.Notification.Success('Record(s) cancelled!');
            }).always(function () {
                that.html(html);
                that.removeClass('disabled');
            });

            return;
        }
        DMS.Notification.Error('Please select a record first.');	
});

postBtn.click(function(){
var that = $(this);
var html = that.html();	
recordArr = GetModelForSelectedRecords(posted);	
if (recordArr.length > 0) {
            that.html('<i class="fa fa-spinner fa-spin"></i>&nbsp;PROCESSING..');
            that.addClass('disabled');

            var url = "/api/EditableGrid/UpdateRecords";
            var json = JSON.stringify(recordArr);
            var service = Service('PUT', url, json, DMS.Helpers.DefaultErrorHandler);

            service.then(function () {
                DMS.Helpers.RefreshEntityList();
                DMS.Notification.Success('Record(s) posted!');
            }).always(function () {
                that.html(html);
                that.removeClass('disabled');
            });

            return;
        }
        DMS.Notification.Error('Please select a record first.');		
	
});


function GetModelForSelectedRecords(transferStatus) {
        var result = [];
        var arr = { Id: null, Entity: null, Records: [] };

        // get configuration from adx layout config.
        var _layouts = $('.entitylist[data-view-layouts]').data("view-layouts");
        arr.Entity = _layouts[0].Configuration.EntityName;

        $('.entity-grid .view-grid table tbody tr').each(function () {
            var that = $(this);
            var isRowSelected = that.find('td:first').data('checked');

            // row is approved
            if (isRowSelected == "true") {

                arr.Id = that.data('id');
                var row = {
                    Attr: 'gsc_transferstatus',
                    Value: transferStatus,
                    Type: 'Microsoft.Xrm.Sdk.OptionSetValue'
                }
                 arr.Records.push(row);
                 result.push(arr);                
            }
        });
        return result;
    }
});