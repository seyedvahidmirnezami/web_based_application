function initSaveTab() {
    var imgScale = $("#imageScale").val();
    $("#saveTabScale").text(String(imgScale));
    
    var colorModel = $("#inputColorModel").find(":selected").text();
    $("#saveTabColorModel").text(colorModel);
    
    var rThresh = $("#rThreshold").val();
    $("#saveTabRthreshold").text(String(rThresh));
    
    var gThresh = $("#gThreshold").val();
    $("#saveTabGthreshold").text(String(gThresh));
    
    var bThresh = $("#bThreshold").val();
    $("#saveTabBthreshold").text(String(bThresh));
    
    var useAdaptive = $("#useAdaptiveThreshold").is(":checked");
    $("#saveTabUseAdaptiveThreshold").text(String(useAdaptive));
    
    if(useAdaptive){
        $(".saveTabAdaptiveThresholdValues").show();
        
        var componentToThresh = $("#adaptiveThresholdComponent").find(":selected").text();
        $("#saveTabComponentToThreshold").text(componentToThresh);
        
        var adaptiveThresh = $("#adaptiveThreshold").val();
        $("#saveTabAdaptiveThreshold").text(String(adaptiveThresh));
        
        var windowSize = $("#adaptiveThresholdWindowSize").val();
        $("#saveTabWindowSize").text(String(windowSize));
    }
    
    var gaussianFilter = $("#gaussianFilter").val();
    $("#saveTabGaussianFilter").text(String(gaussianFilter));
    
    var noiseSize = $("#noiseSize").val();
    $("#saveTabNoiseSize").text(String(noiseSize));
}

/*
    function to turn on/show given element
*/
function on(element)  {
    var x = document.getElementById(element);
    if (x.style.display != 'block') {
        x.style.display = 'block';
    }
}

/*
    turns element to hidden if not already done
*/
function off(element)   {
    var x = document.getElementById(element);
    if (x.style.display != 'none') {
        x.style.display = 'none';
    }
}

function getBase64(file) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
     console.log(reader.result);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
}

/*
    Ajax call to python function
        Sends img data as base64
        A base64 string is returned from python fucntion
    Put new img in processedImg element
*/
function threshold()    {
        //get file, convert to base64 URL
        var img = document.getElementById('inputImageFileInput').files[0];
        var reader = new FileReader();
        reader.readAsDataURL(img);

        //Check color model, then get corresponding threshold values
        var type = document.getElementById('inputColorModel').value;
        if (type == 'rgb')  {
            var red = document.getElementById('rRGBThreshold').value;
            var green = document.getElementById('gRGBThreshold').value;
            var blue = document.getElementById('bRGBThreshold').value;
        }
        else if (type == 'hsv')  {
            var red = document.getElementById('rHSVThreshold').value;
            var green = document.getElementById('gHSVThreshold').value;
            var blue = document.getElementById('bHSVThreshold').value;
        }
        else if (type == 'lab')  {
            var red = document.getElementById('rLABThreshold').value;
            var green = document.getElementById('gLABThreshold').value;
            var blue = document.getElementById('bLABThreshold').value;
        }
        else    {
            var red = document.getElementById('bwThreshold').value;
            var green = 6;
            var blue = 6;
        }

        //Get remaining parameters to send
        var filter = document.getElementById('gaussianFilter').value;
        var sigma = document.getElementById('noiseSize').value;
        var channel = document.getElementById('adaptiveThresholdComponent').value;
        var value = document.getElementById('adaptiveThreshold').value;
        var window_size = document.getElementById('adaptiveThresholdWindowSize').value;

        //Ajax call inside of onload so it is more responsive
        reader.onload = function () {
            base = reader.result;
            $.ajax({
                type: "GET",
                url: '/filter', //URL is Django view by same name
                data: {"image": base,"red": red, "green": green, "blue": blue, "filter": filter, "sigma": sigma, "type": type, "channel": channel, "value": value, "window": window_size},
                // cache: false,
                dataType: "jsonp",
                succes: function(base){ //On ajax success (never happens for some reason)
                    //Parse return data, set as source for img
                    new_data = JSON.parse(base.responseText);
                    document.getElementById("imagesTabProccessedImg").src = new_data;
                },
                error: function(base){  //On error, still works though
                    //Parse return data, set as source for img
                    new_data = JSON.parse(base.responseText);
                    document.getElementById("imagesTabProccessedImg").src = new_data;
                },
            });
        }
}

//Same as threshold function, only used for testing
function threshold_test()    {
        var img = document.getElementById('inputImageFileInput').files[0];
        var reader = new FileReader();
        reader.readAsDataURL(img);

        
        var type = document.getElementById('inputColorModel').value;

        if (type == 'rgb')  {
            var red = document.getElementById('rRGBThreshold').value;
            var green = document.getElementById('gRGBThreshold').value;
            var blue = document.getElementById('bRGBThreshold').value;
        }
        else if (type == 'hsv')  {
            var red = document.getElementById('rHSVThreshold').value;
            var green = document.getElementById('gHSVThreshold').value;
            var blue = document.getElementById('bHSVThreshold').value;
        }
        else if (type == 'lab')  {
            var red = document.getElementById('rLABThreshold').value;
            var green = document.getElementById('gLABThreshold').value;
            var blue = document.getElementById('bLABThreshold').value;
        }
        else    {
            var red = document.getElementById('bwThreshold').value;
            var green = 6;
            var blue = 6;
        }
        var filter = document.getElementById('gaussianFilter').value;
        var sigma = document.getElementById('noiseSize').value;
        var channel = document.getElementById('adaptiveThresholdComponent').value;
        var value = document.getElementById('adaptiveThreshold').value;
        var window_size = document.getElementById('adaptiveThresholdWindowSize').value;


        reader.onload = function () {
            base = reader.result;
            $.ajax({
                type: "GET",
                url: '/filter',
                data: {"image": base,"red": red, "green": green, "blue": blue, "filter": filter, "sigma": sigma, "type": type, "channel": channel, "value": value, "window": window_size},
                // cache: false,
                dataType: "jsonp",
                succes: function(base){
                    console.log("success");
                    new_data = JSON.parse(base.responseText);
                    document.getElementById("imagesTabProccessedImg").src=new_data;
                },
                error: function(base){
                    console.log("error");
                    new_data = JSON.parse(base.responseText);
                    return ("My name is joe.");
                },
            });
        }
}

//Incomplete, very similar to threshold function.
//Goal is to return proccessed images to be saved so can produce batches of thresholded images
function produce(i)    {
        var img = document.getElementById('productionDirectoryInput').files[i];
        var reader = new FileReader();
        reader.readAsDataURL(img);
        
        var type = document.getElementById('inputColorModel').value;

        if (type == 'rgb')  {
            var red = document.getElementById('rRGBThreshold').value;
            var green = document.getElementById('gRGBThreshold').value;
            var blue = document.getElementById('bRGBThreshold').value;
        }
        else if (type == 'hsv')  {
            var red = document.getElementById('rHSVThreshold').value;
            var green = document.getElementById('gHSVThreshold').value;
            var blue = document.getElementById('bHSVThreshold').value;
        }
        else if (type == 'lab')  {
            var red = document.getElementById('rLABThreshold').value;
            var green = document.getElementById('gLABThreshold').value;
            var blue = document.getElementById('bLABThreshold').value;
        }
        else    {
            var red = document.getElementById('bwThreshold').value;
            var green = 6;
            var blue = 6;
        }

        var filter = document.getElementById('gaussianFilter').value;
        var sigma = document.getElementById('noiseSize').value;
        var channel = document.getElementById('adaptiveThresholdComponent').value;
        var value = document.getElementById('adaptiveThreshold').value;
        var window_size = document.getElementById('adaptiveThresholdWindowSize').value;

        reader.onload = function () {
            base = reader.result;
            $.ajax({
                type: "GET",
                url: '/filter',
                data: {"image": base,"red": red, "green": green, "blue": blue, "filter": filter, "sigma": sigma, "type": type, "channel": channel, "value": value, "window": window_size},
                // cache: false,
                dataType: "jsonp",
                succes: function(base){
                    console.log("success");
                    new_data = JSON.parse(base.responseText);
                    var x = "";
                    x = x + new_data;
                },
                error: function(base){
                    console.log("error");
                    new_data = JSON.parse(base.responseText);
                    var x = "";
                    x = x + new_data;
                    return(x);
                },
            });
        }
}

$(function() {
    $( "#tabs" ).tabs();
    
    /* Start tab controls */
    $("#configureSettingsBtn").click(function() {
        $("#tabs").tabs("option", "active", 1);
    });
    
    $("#productionBtn").click(function() {
        $("#tabs").tabs("option", "active", 5);
    });
    
    
    /* Crop type tab controls */
    $("#backFromCropTypeBtn").click(function(){
        $("#tabs").tabs("option", "active", 0);
    });
    
    $("#nextFromCropTypeBtn").click(function(){
        $("#tabs").tabs("option", "active", 2);
    });
    
    
    /* Image tab controls */
    $("#backFromImageTabBtn").click(function() {
        $("#tabs").tabs('option', 'active', 1);
    });
    
    $("#nextFromImageTabBtn").click(function() {
        $("#tabs").tabs('option', 'active', 3);
    });
    
    $("#inputColorModel").change(function() {
        $(this).find(":selected").val();
    });
    
    $("#useAdaptiveThreshold").change(function() {
        var checked = $(this).is(":checked");
        $("#adaptiveThresholdInputsDiv").toggle(checked);
    });
    
    $("#adaptiveThresholdComponent").change(function() {
        $(this).find(":selected").val();
    });

    /*
        On change of any of the sliders or click of the interact button
            Call threshold to proccess image and update source
    */
    $('#rRGBThreshold').change(function() {
        threshold();
    });
    
    $('#gRGBThreshold').change(function() {
        threshold();
    });

    $('#bRGBThreshold').change(function() {
        threshold();
    });
    $('#rHSVThreshold').change(function() {
        threshold();
    });
    $('#gHSVThreshold').change(function() {
        threshold();
    });
    $('#bHSVThreshold').change(function() {
        threshold();
    });
    $('#rLABThreshold').change(function() {
        threshold();
    });
    $('#gLABThreshold').change(function() {
        threshold();
    });
    $('#bLABThreshold').change(function() {
        threshold();
    });
    $('#bwThreshold').change(function() {
        threshold();
    });

    $("#interactBtn").click(function()  {
        threshold();
    });

    /*
        On change of color model element
            Hide unnecessary sliders
            Show selected slider
    */
    $("#inputColorModel").change(function() {
        var model = document.getElementById("inputColorModel").value;

        if (model == 'rgb') {
            on('rgbThresh');
            off('hsvThresh');
            off("labThresh");
            off('bwThresh');
        }
        else if (model == 'hsv')    {
            on('hsvThresh');
            off('rgbThresh');
            off('labThresh');
            off('bwThresh');
        }
        else if (model == 'lab')    {
            on('labThresh');
            off('rgbThresh');
            off('hsvThresh');
            off('bwThresh');
        }
        else    {
            on('bwThresh');
            off('rgbThresh');
            off('hsvThresh');
            off('labThresh');
        }
    });

    $("#inputImageFileInput").change(function() {
        var file = document.getElementById('inputImageFileInput').files[0];
        var filename = file.name;
        $("#imageInputLabel").text(filename);
        
        //Load and set image:
        var reader = new FileReader();
        reader.onload = function (e) {
           $('#imagesTabOriginalImg').attr('src', e.target.result);
           // $('#imagesTabProccessedImg').attr('src', e.target.result);
           $("#imageInputsDiv, #imageTabBtnsDiv, #imageTabImagesDiv").show();
           $("#nextFromImageTabBtn").prop('disabled', false);
        };
        reader.readAsDataURL(file);
        $("#inputColorModel").change();
    });
    
    /* Need to hide file input button and use another delegating button
       to get custom file button styling
    */
    $("#selectInputImageBtn").click(function() {
        $("#inputImageFileInput").click();
    });

    /*
        Inverts color of image on click
        Very similar to threshold, but only to a different URL (Django View)
    */
    $("#invertBtn").click(function()  {
        //Get files, convert to base64
        var img = document.getElementById('inputImageFileInput').files[0];
        var reader = new FileReader();
        reader.readAsDataURL(img);

        reader.onload = function () {
            base = reader.result;
        };

        $.ajax({
            type: "GET",
            url: '/invert', //invert Django view just returns the negative of the image
            data: {"image": base},
            cache: false,
            dataType: "jsonp",
            succes: function(){//rest of it is same as threshold
                console.log("success");
                data = JSON.parse(base.responseText);
                document.getElementById("imagesTabProccessedImg").src=data;
            },
            error: function(base){
                console.log("error");
                data = JSON.parse(base.responseText);
                document.getElementById("imagesTabProccessedImg").src=data;
            },
        });
    });

    /*
        SAVES SETTINGS, not reset
    */
    $("#resetInputsBtn").click(function()   {
        window.img_scale = document.getElementById("imageScale").value;
        document.getElementById("saveTabScale").innerHTML = img_scale;

        window.color_model = document.getElementById("inputColorModel").value;
        document.getElementById("saveTabColorModel").innerHTML = color_model;

        window.gaussian = document.getElementById("gaussianFilter").value;
        document.getElementById("saveTabGaussianFilter").innerHTML = gaussian;

        window.noise = document.getElementById("noiseSize").value;
        document.getElementById("saveTabNoiseSize").innerHTML = noise;

        //Depending on color model used, saves correct color values
        if (window.color_model == 'rgb')    {
            window.red = document.getElementById("rRGBThreshold").value;
            document.getElementById("saveTabRthreshold").innerHTML = red;

            window.green = document.getElementById("gRGBThreshold").value;
            document.getElementById("saveTabGthreshold").innerHTML = green;

            window.blue = document.getElementById("bRGBThreshold").value;
            document.getElementById("saveTabBthreshold").innerHTML = blue;
        }
        else if (window.color_model == 'hsv')    {
            window.red = document.getElementById("rHSVThreshold").value;
            document.getElementById("saveTabRthreshold").innerHTML = red;

            window.green = document.getElementById("gHSVThreshold").value;
            document.getElementById("saveTabGthreshold").innerHTML = green;

            window.blue = document.getElementById("bHSVThreshold").value;
            document.getElementById("saveTabBthreshold").innerHTML = blue;
        }
        else if (window.color_model == 'lab')    {
            window.red = document.getElementById("rLABThreshold").value;
            document.getElementById("saveTabRthreshold").innerHTML = red;

            window.green = document.getElementById("gLABThreshold").value;
            document.getElementById("saveTabGthreshold").innerHTML = green;

            window.blue = document.getElementById("bLABThreshold").value;
            document.getElementById("saveTabBthreshold").innerHTML = blue;
        }
        else    {
            window.red = document.getElementById("bwThreshold").value;
            document.getElementById("saveTabRthreshold").innerHTML = red;
        }
        $("#inputColorModel").change(); //calls change so the correct sliders are shown
        threshold();    //update proccessed image to new values
    })

    /*
        On click, settings are reset to the saved values
            Saves settings, sets Save Tab elements to corresponding values        
    */
    $("#saveProcessedImgBtn").click(function()   {
        document.getElementById("imageScale").value = window.img_scale;
        document.getElementById("inputColorModel").value = window.color_model;
        document.getElementById("gaussianFilter").value = window.gaussian;
        document.getElementById("noiseSize").value = window.noise;

        //Depending on the color model used, will reset correct slider
        if (window.color_model == 'rgb')    {
            document.getElementById("rRGBThreshold").value = window.red;
            document.getElementById("gRGBThreshold").value = window.green;
            document.getElementById("bRGBThreshold").value = window.blue;
        }
        else if (window.color_model == 'hsv') {
            document.getElementById("rHSVThreshold").value = window.red;
            document.getElementById("gHSVThreshold").value = window.green;
            document.getElementById("bHSVThreshold").value = window.blue;
        }
        else if (window.color_model == 'lab')   {
            document.getElementById("rLABThreshold").value = window.red;
            document.getElementById("gLABThreshold").value = window.green;
            document.getElementById("bLABThreshold").value = window.blue;
        }
        else    {
            document.getElementById("bwThreshold").value = window.red;
        }
    })
    
    /* Plot tab controls */
    $("#backFromPlotTabBtn").click(function() {
        $("#tabs").tabs("option", "active", 2);
    });
    
    $("#nextFromPlotTabBtn").click(function() {
        //Go to save tab & init values
        $("#tabs").tabs("option", "active", 4);
        
        initSaveTab();
    });
    
    /* Save tab controls */
    $("#backFromSaveTabBtn").click(function() {
        $("#tabs").tabs("option", "active", 3);
    });
    
    $("#nextFromSaveTabBtn").click(function() {
        $("#tabs").tabs("option", "active", 5);
    });
    
    /*Production tab controls */
    $("#selectProductionImagesBtn").click(function() {
        $("#productionDirectoryInput").click();

    });
    
    $("#selectProductionSettingsBtn").click(function() {
        $("#productionSettingsInput").click();
    });
    
    /*
        Incomplete
            Goal is to iterate through each image in directory, and process each through AJAX call
            Currently not working due to problem with produce() function
    */
    $("#productionDirectoryInput").change(function() {
        var files = document.getElementById('productionDirectoryInput').files;
        // var filename = file.name;
        // $("#productionSettingsLabel").text(filename);
        var img_arr = new Array();

        for (var i = 0; i < files.length; i++)
        {
            img_arr[i] = produce(i);
        }

        alert(img_arr[1]);
    //     //Load and set image:
    //     var reader = new FileReader();
    //     reader.onload = function () {
    //        //TODO
    //     };
    //     reader.readAsDataURL(file);
    });
    
});