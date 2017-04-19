var app = require("application");
var stackModule = require("ui/layouts/stack-layout");
var gridModule = require("ui/layouts/grid-layout");
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var checkModule = require("nativescript-checkbox");
var dropModule = require("nativescript-drop-down");
var radioBtnModule = require("nativescript-radiobutton");
var buttonModule = require("ui/button");
var labelModule = require("ui/label");
var listViewModule = require("ui/list-view");
var scrollModule = require("ui/scroll-view");
var textFieldModule = require("ui/text-field");
var webModule = require("ui/web-view");
var localStorage = require("nativescript-localstorage");
var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;

function createRows(numbRows , arrayRows , gridLayout, RowHeight, RowMode) {

    for ( i = 0 ; i < numbRows ; i++ )
    {

        arrayRows[i] = new gridModule.ItemSpec(RowHeight, gridModule.GridUnitType[RowMode]);
        gridLayout.addRow(arrayRows[i]);


    }

}

function createColumns(numbColumns , arrayColumns , gridLayout, ColumnHeight, ColumnMode) {

    for ( i = 0 ; i < numbColumns ; i++ )
    {
            arrayColumns[i] = new gridModule.ItemSpec(ColumnHeight, gridModule.GridUnitType[ColumnMode]);

        gridLayout.addColumn(arrayColumns[i]);

    }

}

function createList(page) {
    var layout = new stackModule.StackLayout();

    var jsonString = '{"title":"SOMETHING","listItems":["oi","fkukid"]}'; // <------- Can be replaced with the localstorage sting
    var myJSON = JSON.parse(jsonString);

    var labelTitle = new labelModule.Label();
    labelTitle.className = "labelTitle";
    labelTitle.text = myJSON.title;

    var listView = new listViewModule.ListView();
    listView.items = [];
    listView.items = myJSON.listItems;    

    layout.addChild(labelTitle);
    layout.addChild(listView);

    page.content = layout;

}

function createForm(page){
    pageForm = page;
    var viewModule = new observable.Observable();

    var myJSON = '{"form":[{"Type":"textfield","id":"textfield1","text":"","hint":"write your email","varName":"email"},{"Type":"button","id":"button1","text":"click me","varName":"QrCode","value":"coiso"},{"Type":"checkbox","id":"checkbox","text":"click me","varName":"checkBox","value":"coisito"},{"Type":"dropdown","id":"dropdown","items":["Escolha uma opção","as","oi"],"varName":"dropDown"},{"Type":"radiobutton","id":"radiobutton","text":"radio","varName":"radioButtton","value":"coisital"}]}';
    var jaaason = JSON.parse(myJSON);
    var fieldsSize = jaaason.form.length;
    
    var newStackLayout = new stackModule.StackLayout();

    var fieldsArray = new Array();

    for(i=0; i < fieldsSize; i++){
        switch(jaaason.form[i].Type){
            case "checkbox":
                fieldsArray[i] = new checkModule.CheckBox();
                fieldsArray[i].value = jaaason.form[i].value;
            break;
            case "dropdown":
                var arrayDados = new Array();
                fieldsArray[i] = new dropModule.DropDown();
                fieldsArray[i].items = jaaason.form[i].items;
            break;
            case "radiobutton":
                fieldsArray[i] = new radioBtnModule.RadioButton();
                fieldsArray[i].radioGroup = jaaason.form[i].group;
                fieldsArray[i].value = jaaason.form[i].value;
            break;
            case "button":
                fieldsArray[i] = new buttonModule.Button();
               /* fieldsArray[i].on(buttonModule.Button.tapEvent, function() {
                    navigate
                    var barcodescanner = new BarcodeScanner();
                    barcodescanner.scan({
                        formats: "QR_CODE",   // Pass in of you want to restrict scanning to certain types
                        //cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
                        //cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
                        message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
                        showFlipCameraButton: true,   // default false
                        preferFrontCamera: false,     // default false
                        showTorchButton: true,        // default false
                        beepOnScan: true,             // Play or Suppress beep on scan (default true)
                        torchOn: false,               // launch with the flashlight on (default false)
                        resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
                        orientation: "portrait",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
                        //openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
                    }).then(
                        function(result) {
                            console.log("Scan format: " + result.format);
                            console.log("Scan text:   " + result.text);
                            localStorage.setItem("merda",result.text);
                        },
                        function(error) {
                            console.log("No scan: " + error);
                        }
                    );
                });*/
            break;
            case "label":
                fieldsArray[i] = new labelModule.Label();
            break;
            case "textfield":
                fieldsArray[i] = new textFieldModule.TextField();
                fieldsArray[i].hint = jaaason.form[i].hint;
                fieldsArray[i].value = jaaason.form[i].value;
            break;
        }
        fieldsArray[i].id = jaaason.form[i].id;
        fieldsArray[i].text = jaaason.form[i].text;
        
        newStackLayout.addChild(fieldsArray[i]);
            
    }
    var submitBtn = new buttonModule.Button();
    submitBtn.text = "submit";
    newStackLayout.addChild(submitBtn);
    pageForm.content = newStackLayout;

    submitBtn.on(buttonModule.Button.tapEvent, function (){
        var submitInfo = "";
        for(i = 0; i < fieldsSize; i++)
        {
            switch(jaaason.form[i].Type)
            {
                case "textfield":
                    if(i == 0){
                        submitInfo = fieldsArray[i].text;
                    }
                    else{
                        submitInfo = submitInfo + "," + fieldsArray[i].text;
                    }
                break;
                case "dropdown":
                    if(i == 0){
                        submitInfo = fieldsArray[i].items[fieldsArray[i].selectedIndex];
                    }
                    else{
                        submitInfo = submitInfo + "," + fieldsArray[i].items[fieldsArray[i].selectedIndex];
                    }
                break;
                case "checkbox":
                    if(i == 0){
                        submitInfo = fieldsArray[i].checked;
                    }
                    else{
                        submitInfo = submitInfo + "," + fieldsArray[i].checked;
                    }
                break;
                case "radiobutton":
                    if(i == 0){
                        submitInfo = fieldsArray[i].checked;
                    }
                    else{
                        submitInfo = submitInfo + "," + fieldsArray[i].checked;
                    }
                break;
              /*  case "button":
                    if(i == 0){
                        submitInfo = fieldsArray[i].value
                    }
                    else{
                        submitInfo = submitInfo + "," + fieldsArray[i].value;
                    }
                break;*/
            }
        }

    console.log(submitInfo);
    });
}


function createWebView(page){
    var mygrid = new gridModule.GridLayout();
    var txt1 = new textFieldModule.TextField();
    var btnsearch = new buttonModule.Button();
    var myweb = new webModule.WebView();

    var colunas = new Array();
    var linhas = new Array();

    //txt1.height = 30;
    txt1.id = "txtsearch";

    //btnsearch.height = 30;
    btnsearch.text = "Search";
    btnsearch.id = "btnsearch";

    if(localStorage.getItem("default_url") == null){
        myweb.url = "";
        txt1.text = "http://";
        alert("URL is not defined");
    }else{
        myweb.url = localStorage.getItem("default_url");
        txt1.text = localStorage.getItem("default_url");
    }
    
    btnsearch.on(buttonModule.Button.tapEvent, function (){
        myweb.url = txt1.text;
    });

    createRows(1,linhas,mygrid,50,"pixel");
    createRows(1,linhas,mygrid,500,"pixel");
    createColumns(1,colunas,mygrid,230,"pixel");
    createColumns(1,colunas,mygrid,90,"pixel");

    gridModule.GridLayout.setColumn(txt1,0);
    gridModule.GridLayout.setRow(txt1,0);
    mygrid.addChild(txt1);

    gridModule.GridLayout.setColumn(btnsearch,1);
    gridModule.GridLayout.setRow(btnsearch,0);
    mygrid.addChild(btnsearch);

    gridModule.GridLayout.setColumn(myweb,0);
    gridModule.GridLayout.setRow(myweb,1);
    gridModule.GridLayout.setColumnSpan(myweb, 2)
    mygrid.addChild(myweb);

    page.content = mygrid;

}

exports.constructorLoad = function(args) {

    var page = args.object
    //info = button value; JSON constructor comes from the button JSON parameter
    var Info = "form";
    //localStorage.setItem("default_url","http://www.google.com");
    //localStorage.clear();
   if( Info.toLowerCase() == "list" ){

        createList();

   } else if ( Info.toLowerCase() == "form" ) {

        createForm(page);

   } else if ( Info.toLowerCase() == "webview" ) {

        createWebView(page);

   } else if ( Info.toLowerCase() == "options" ) {

        createOptions();

   } else {

        alert("NOPE!");
        //error

   }

}