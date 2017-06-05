var app = require("application");
var stackModule = require("ui/layouts/stack-layout");
var gridModule = require("ui/layouts/grid-layout");
//var checkModule = require("nativescript-checkbox");
var dropModule = require("nativescript-drop-down");
//var radioBtnModule = require("nativescript-radiobutton");
var buttonModule = require("ui/button");
var labelModule = require("ui/label");
var listViewModule = require("ui/list-view");
var scrollModule = require("ui/scroll-view");
var textFieldModule = require("ui/text-field");
var textViewModule = require("ui/text-view");
var webModule = require("ui/web-view");
var frameModule = require("ui/frame");
var topmost = frameModule.topmost();
var localStorage = require("nativescript-localstorage");
var spansModule = require("text/span");
var formattedStringModule = require("text/formatted-string");
var dialogs = require("ui/dialogs");
var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
var Connection = require("../../shared/DB_connection");
var con = new Connection();
var page;

function createRows(numbRows , arrayRows , gridLayout, RowHeight, RowMode)
{
    for(i = 0; i < numbRows; i++)
    {
        arrayRows[i] = new gridModule.ItemSpec(RowHeight, RowMode);
        gridLayout.addRow(arrayRows[i]);
    }
}

function createColumns(numbColumns , arrayColumns , gridLayout, ColumnHeight, ColumnMode)
{
    for(i = 0 ; i < numbColumns ; i++)
    {
        arrayColumns[i] = new gridModule.ItemSpec(ColumnHeight, ColumnMode);
        gridLayout.addColumn(arrayColumns[i]);
    }
}

function createView(finalView , drawView , formName)
{
    page.actionBar.title = formName;

    gridModule.GridLayout.setColumn(drawView,0);
    gridModule.GridLayout.setRow(drawView,0);
    gridModule.GridLayout.setColumnSpan(drawView,3);

    finalView.addChild(drawView);
}

function createBottomNavButton(viewGrid,iconString,navTo,booleanClear,row,col)
{
    var options_colors = localStorage.getItem("Options");

    var xButton = new buttonModule.Button();
    var textSpan = new spansModule.Span();
    var xFormattedString = new formattedStringModule.FormattedString();
    var xIconSpan = new spansModule.Span();

    xButton.className = "btnIcon";
    xButton.backgroundColor = options_colors.color_button;
    xButton.color = options_colors.color_text;

    xButton.borderColor = "black"
    
    xIconSpan.fontSize = 25;
    xIconSpan.text = String.fromCharCode(iconString);

    xFormattedString.spans.push(xIconSpan);

    xButton.formattedText = xFormattedString;
    xButton.on(buttonModule.Button.tapEvent , function()
    {
        var navigationOptions =
        {
            moduleName: navTo,
            clearHistory: booleanClear
        }
        topmost.navigate(navigationOptions);
    });

    gridModule.GridLayout.setColumn(xButton,col);
    gridModule.GridLayout.setRow(xButton,row);
    viewGrid.addChild(xButton);
}

function removeSelectedItem(tappedItemIndex)
{
   var data = localStorage.getItem(localStorage.getItem("targetTable"));

    var stuff = [];
    var infoArray = [];
    var i = 0;
    var j = 0;

    for(i = 0 ; i < data.camps.length ; i++)
    {
        infoArray = [];
        for(j = 0 ; j < (data.campsInfo[0].length - 1 ) ; j++)
        {
            if( j == tappedItemIndex ){
                if( j == data.campsInfo[0].length){
                } else {
                    j++;
                    infoArray.push(data.campsInfo[i][j]);
                }
            } else {
                infoArray.push(data.campsInfo[i][j]);
            }
        }
        stuff[i] = infoArray;
    }   

    for(i = 0 ; i < data.camps.length ; i++)
    {
        con.addListInfo('/list/campsInfo/' + i , stuff[i]);
    }
    
    data.campsInfo = stuff;

    localStorage.setItem(localStorage.getItem("targetTable") , data);

    alert("Removido");

    var navigationOptions =
    {
        moduleName: "views/constructor-view/constructor",
        context: { 
            typeView: "list", targetTable: localStorage.getItem("targetTable")
        }
    }
    topmost.navigate(navigationOptions);
}

function editSelectedItem(tappedItemIndex)
{

    var navigationOptions = {

        moduleName: "views/add-list/addlist",
        context: { info: tappedItemIndex },
        clearHistory: false
    }
        
    topmost.navigate(navigationOptions);
}

function drawList(data,viewGrid)
{
    var viewLayout = new gridModule.GridLayout();

    var arrayRows = new Array();
    var arrayColumns = new Array();

    var numbColumns = data.camps.length;
    var titleArray = data.camps;
    var toShowCamps = data.showCamps.campLocation.length;

    createColumns(toShowCamps,arrayColumns,viewLayout,1,"star");
    createRows(1,arrayRows,viewLayout,50,"pixel");
    createRows(1,arrayRows,viewLayout,1,"auto");

    var xLabels = new Array(toShowCamps);
    var xList = new listViewModule.ListView();
    
    for(i = 0 ; i < toShowCamps ; i++)
    {
        xLabels[i] = new labelModule.Label();
        xLabels[i].text = titleArray[data.showCamps.campLocation[i]];
        xLabels[i].className = "Title";
        
        gridModule.GridLayout.setColumn(xLabels[i],i);
        gridModule.GridLayout.setRow(xLabels[i],0);
        viewLayout.addChild(xLabels[i]);
    }

    xList.itemTemplate = data.itemTemplate;
    xList.className = "Info";

    var listArray = new Array();
    var listItems = {};

    for(i = 0 ; i < data.campsInfo[0].length ; i++)
    {
        listItems = {};
        for(j = 0 ; j < toShowCamps ; j++)
        {
            // error is here
            //listItems[titleArray[j]] = data.campsInfo[data.showCamps.campLocation[j]][i];
        }
        // listArray.push(listItems);
    }

    xList.items = listArray;

    xList.on(listViewModule.ListView.itemTapEvent, function (args) {

        var tappedItemIndex = args.index;

        dialogs.confirm({

            title: "Registo " + (tappedItemIndex + 1),
            message: "Pretende alterar ou remover o registo?",
            okButtonText: "CANCEL",
            neutralButtonText: "Alterar",
            cancelButtonText: "Remover"

        }).then(function (result) {

            if( result == false)
            {

                removeSelectedItem(tappedItemIndex);

            }
            else if( result == undefined )
            {

                editSelectedItem(tappedItemIndex);

            }
            else {}

        });
    });

    // Add ListView to View
    gridModule.GridLayout.setColumn(xList,0);
    gridModule.GridLayout.setRow(xList,1);
    gridModule.GridLayout.setColumnSpan(xList,numbColumns);
    
    viewLayout.addChild(xList);

    createView(viewGrid , viewLayout , "ListView");
    
    page.content = viewGrid;
};

requestForm = function(constructorForm,viewGrid)
{
    var targetTable = localStorage.getItem("targetTable");
    if(constructorForm == "form")
    {
        drawForm(localStorage.getItem(targetTable),viewGrid);
    }
    else if(constructorForm == "list")
    {
         drawList(localStorage.getItem(targetTable),viewGrid); 
    } 
}

drawForm = function(data,viewGrid){

    var fieldsSize = data.length;

    var newStackLayout = new stackModule.StackLayout();
    var scrollView = new scrollModule.ScrollView();

    var fieldsArray = new Array();

    for(i=0; i < fieldsSize; i++){
        const cont = i;
        switch(data[cont].type){
            case "checkbox":
                /*fieldsArray[cont] = new checkModule.CheckBox();
                fieldsArray[cont].value = data[cont].value;
                fieldsArray[cont].id = data[cont].id;
                fieldsArray[cont].text = data[cont].text;

                newStackLayout.addChild(fieldsArray[cont]);*/
            break;

            case "dropdown":
                var arrayDados = new Array();
                fieldsArray[cont] = new dropModule.DropDown();
                fieldsArray[cont].items = data[cont].items;
                fieldsArray[cont].id = data[cont].id;
                fieldsArray[cont].selectedIndex = 0;

                newStackLayout.addChild(fieldsArray[cont]);
            break;

            case "radiogroup":
                /*fieldsArray[cont] = new radioBtnModule.RadioGroup();
                fieldsArray[cont].id = data[cont].id;
                newStackLayout.addChild(fieldsArray[cont]);*/
        
            break;

            case "radiobutton":
                /*fieldsArray[cont] = new radioBtnModule.RadioButton();
                fieldsArray[cont].id = data[cont].id;
                fieldsArray[cont].text = data[cont].text;
                fieldsArray[cont].value = data[cont].value;

                newStackLayout.getViewById(data[cont].group).addChild(fieldsArray[cont]);*/
            break;

            case "label":
                fieldsArray[cont] = new labelModule.Label();
                fieldsArray[cont].id = data[cont].id;
                fieldsArray[cont].text = data[cont].text;

                newStackLayout.addChild(fieldsArray[cont]);
            break;

            case "textfield":
                fieldsArray[cont] = new textFieldModule.TextField();
                fieldsArray[cont].hint = data[cont].hint;
                fieldsArray[cont].id = data[cont].id;

                newStackLayout.addChild(fieldsArray[cont]);
            break;

            case "textview":
                fieldsArray[cont] = new textViewModule.TextView();
                fieldsArray[cont].hint = data[cont].hint;
                fieldsArray[cont].id = data[cont].id;

                newStackLayout.addChild(fieldsArray[cont]);
            break;
            
            default:
            break;
        }
    }

    var submitBtn = new buttonModule.Button();
    submitBtn.text = "submit";
    newStackLayout.addChild(submitBtn);
    scrollView.content = newStackLayout;

    createView(viewGrid , scrollView , "FormView");

    page.content = viewGrid;

    submitBtn.on(buttonModule.Button.tapEvent, function (){
        var submitInfo = new Array();
        var varNames = new Array();
        var cont = 0;
        for(i = 0; i < fieldsSize; i++)
        {
            switch(data[i].type)
            {
                case "textfield":
                        submitInfo[i-cont] = fieldsArray[i].text;
                        varNames[i-cont] = data[i].varName;
                break;
                case "dropdown":
                        submitInfo[i-cont] = fieldsArray[i].items[fieldsArray[i].selectedIndex];
                        varNames[i-cont] = data[i].varName;
                break;
                case "checkbox":
                        submitInfo[i-cont] = fieldsArray[i].checked;
                        varNames[i-cont] = data[i].varName;
                break;
                case "radiogroup":
                        var countt = fieldsArray[i]._childrenCount;
                        for(j = 0;j < countt; j ++){
                            if(fieldsArray[i]._subViews[j].checked == true){
                                submitInfo[i-cont] = fieldsArray[i]._subViews[j].value;
                                varNames[i-cont] = data[i].varName;
                            }
                            else{
                                submitInfo[i-cont] = "null";
                                varNames[i-cont] = data[i].varNames;
                            }
                        }
                break;
                case "textview":
                        submitInfo[i-cont] = fieldsArray[i].text;
                        varNames[i-cont] = data[i].varName;
                break;
                case "label":
                    cont +=1;
                break;
                default:
                    cont +=1;
                break;
            }
        }

        con.add('/aasd', submitInfo);
        alert("Sended to database");
        var navigationOptions =
        {
            moduleName: "views/main-api-view/main-api",
            clearHistory: true
        }
        topmost.navigate(navigationOptions);
    });
}

exports.constructorLoad = function(args)
{
    page = args.object;

    localStorage.setItem("currentPage" , "construct");

    var Options = localStorage.getItem("Options");

    page.bindingContext = { ActionColor: Options.color_actionBar};
    page.actionBar.actionItems._items[0].visibility = "collapse";
    page.actionBar.color = Options.color_text;

    var gotData = page.navigationContext;
    var Info = gotData.typeView;

    localStorage.setItem("targetTable" , gotData.targetTable);

    var viewGrid = new gridModule.GridLayout();
    var arrayRows = new Array();
    var arrayColumns = new Array();

    createRows(1,arrayRows,viewGrid,1,"star");
    createRows(1,arrayRows,viewGrid,45,"pixel");
    createColumns(3,arrayColumns,viewGrid,1,"star");

    createBottomNavButton(viewGrid,"0xef015","views/main-api-view/main-api",true,1,0);
    createBottomNavButton(viewGrid,"0xef129","views/Info/Info",true,1,1);
    createBottomNavButton(viewGrid,"0xef013","views/options-view/options",false,1,2);

   if(Info.toLowerCase() == "list")
   {
        requestForm("list",viewGrid);
        page.actionBar.actionItems._items[0].visibility = "visible";
   }
   else if(Info.toLowerCase() == "form")
   {
        requestForm("form",viewGrid);
   }
   else
   {
        alert("NOPE!");
   }
}

exports.onAdd = function(args)
{
    page = args.object;
    
    var navigationOptions =
    {
            moduleName: "views/add-list/addlist"
    }
    topmost.navigate(navigationOptions);
}
