//edit method to edit product name sku or  edit/add product details.
$(document).ready(function(){

    jQuery.validator.addMethod("alphanumeric", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
    }); // "value should be alphanumeric only"

    jQuery.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    });

    jQuery.validator.addMethod("size", function(value, element) {
        return this.optional(element) || /^[a-z\s]{1,4}$/i.test(value);
    });

    jQuery.validator.addMethod("numberonly", function (value, element) {
        return this.optional(element) || /^[0-9]+$/.test(value);
    });

    jQuery.validator.addMethod("floatvalue", function (value, element) {
        return this.optional(element) || /^[0-9.]+$/.test(value);
    });

    $("#form1").validate({
        rules: {
            pname: {
                lettersonly:true,
                required: true
            },
            sku: {
                alphanumeric:true,
                required: true            
            },
            
            "pcolor[]": {
                required:true
            },
            "psize[]":{
                required:true 
            } ,
            "pqty[]":{
                required:true 
            } ,
            "pprice[]":{
                required:true 
            }

            
        },
        messages: {
            pname: {
                lettersonly:"only latters are allowed",
                required: "Enter the product name."
            },
            sku: {
                alphanumeric:"only alphanumeric values accepted",
                required: "Enter the SKU ."
            },
            "pcolor[]":{
                required:"Enter color."
            },
            "psize[]":{
                required:"Enter size." 
            } ,
            "pqty[]":{
                required:"Enter quantity."
            } ,
            "pprice[]":{
                required:"Enter price." 
            }
        },
        submitHandler: function (form) {
              savedata();    //callAjax function call here to save data
              return false;
          }
        
    });

});


$(document).on('click' , '.edit' , function(){
    
    var edId = $(this).attr('id');

        $.ajax({
            type:"post",
            data:{
            'edId':edId
            },
            url:"edit.php",
            success:function(response){
                $("#updateform").html(response);
            },
            complete:function(){
                $('#updateModal').click();
               form2_validate();
            }
         }); 
 });  

 function form2_validate(){

    $('#form2').validate({
            rules: {
                pname: {
                    required: true,
                    lettersonly:true,
                },
                sku: {
                    required: true,         
                    alphanumeric:true,
                },
                "pcolor[]": {
                    required:true,
                    lettersonly:true
                },
                "psize[]":{
                    required:true,
                    size:true 
                } ,
                "pqty[]":{
                    required:true,
                    numberonly:true 
                } ,
                "pprice[]":{
                    required:true,
                    floatvalue:true  
                }
            },
            messages: {
                pname: {
                    lettersonly:"only latters are allowed",
                    required: "Enter the product name."
                },
                sku: {
                    alphanumeric:"only alphanumeric values accepted",
                    required: "Enter the SKU ."
                },
                "pcolor[]":{
                    required:"Enter color.",
                    lettersonly:"only letters are accepted"
                },
                "psize[]":{
                    required:"Enter size.",
                    size:"size length from 1 to 4 chars only" 
                } ,
                "pqty[]":{
                    required:"Enter quantity.",
                    numberonly:"only numbers are accepted"
                } ,
                "pprice[]":{
                    required:"Enter price.",
                    floatvalue:"only numbers and float value accepted"
                }
            }
           /* submitHandler: function(form) {
                update();
                return false;
            }*/
        });

 }   


  


$(document).on('click', '#edit_form', function(){
    if($('#form2').valid()){
        update();
    }
    else{
        alert("not valid");
    }  
    return false;
});

//delete methode to delete product from list and delete related product detals as well.
$(document).on('click', '.delete', function(){
 var delId= $(this).attr("id");
 var conf1 = confirm("you realy want to delete this product??");
        if (conf1 == true) {
        	var conf2 = confirm("All data related to this product also get deleted?");
        	if (conf2 == true) {
        		deleteProduct(delId);
        	}   
        }
});

function deleteProduct(delId){
	var delId= delId;
	$.ajax({
        url: 'delete.php',
        type: 'post',
        data: {
        	'delId':delId
        },

                // before ajax request to delete data
    beforeSend: function() {
        $("#result").html("<p class='text-success'> Please wait.. </p>");
    },  

    // on success response
    success:function(response) {
        $("#result").html(response);

    },

     // error response
    error:function(e) {
        $("#result").html("Some error encountered, try again");
    }

    });


}

function addMore() {
   
    var length= $(".ptable tr").length-2;
   
    if(length==0){
        $('<tr class="col-xl-12 tmp" id="1"><td class="col-sm-1" id="">1</td><td class="col-sm-2"><input type="text" class="form-control pcolor"  placeholder="Enter color" name="pcolor[]"></td><td class="col-sm-2"><input type="text" class="form-control psize" placeholder="Enter Size" name="psize[]"></td><td class="col-sm-2"><input type="text" class="form-control pqty"  placeholder="Enter Qty" name="pqty[]"></td><td class="col-sm-2"><input type="text" class="form-control pprice"  placeholder="Enter Price" name="pprice[]"></td><td class="col-sm-1"><button type="button" class="btn btn-danger deleterow"><i class="fa fa-trash"></i> Delete</button></td> </tr>').insertAfter(".ptable tr:last");
    }
    else{
        $id=parseInt($(".tmp:last").attr("id"));
        $t=$(".tmp:last").clone().attr("id", $id+1);
        $t.find("input").each(function()
            {
                $(this).val("");
            })
        $t.insertAfter(".tmp:last");


    }


   
    
   /* $(".tmp:last").find("input").each(function()
    {
        $(this).val("");
    })
    */

    

    $id=parseInt($(".tmp:last").attr("id")); 
    $(".tmp:last td:nth-child(1)").html($id+'<input type="hidden" id="pdid" name="pdid[]" value="0">');
}




function addEditRow() {
    console.log("add called");
    var length= $(".editTable tr").length-2;
    console.log(length);
    if(length==0){
        $('<tr class="col-xl-12 ttmp" id="1"><td class="col-sm-1" id="">1<input type="hidden"  name="pdid[]" value="0"></td><td class="col-sm-2"><input type="text" class="form-control pcolor"  placeholder="Enter color" name="pcolor[]"></td><td class="col-sm-2"><input type="text" class="form-control psize" placeholder="Enter Size" name="psize[]"></td><td class="col-sm-2"><input type="text" class="form-control pqty"  placeholder="Enter Qty" name="pqty[]"></td><td class="col-sm-2"><input type="text" class="form-control pprice"  placeholder="Enter Price" name="pprice[]"></td><td class="col-sm-1"><button type="button" class="btn btn-danger deleterow"><i class="fa fa-trash"></i> Delete</button></td> </tr>').insertAfter(".editTable tr:last");
    }
    else{
        $id=parseInt($(".ttmp:last").attr("id"));
        //$(".ttmp:last").clone().attr("id", $id+1).insertAfter(".ttmp:last");
          $t=$(".ttmp:last").clone().attr("id", $id+1);
        $t.find("input").each(function()
            {
                $(this).val("");
                $(this).attr("value", "");
            })
        $t.insertAfter(".ttmp:last");
    }


   
    
   /* $(".ttmp:last").find("input").each(function()
    {
        $(this).val("");
    })*/

    

    $id=parseInt($(".ttmp:last").attr("id")); 
    $(".ttmp:last td:nth-child(1)").html($id+'<input type="hidden" id="pdid" name="pdid[]" value="0">');
}



$(document).on('click', '.deleterow', function(){ 
     $(this).parent().parent().remove();

});



$(document).on('click', '.deleteRecord', function(){ 
      var a= $(this).parent().parent().children('td:nth-child(1)').children(':nth-child(1)').attr('value');

       if(a==0){
        $(this).parent().parent().remove();

       }
    else{
       var conf = confirm("you realy want to delete this product??"); //calling ajax to delete data from data base
        if (conf1 == true) {
        $.ajax({
            url: 'delete.php',
            type: 'post',
            data: {
                'delPid':a

            },

                // before ajax request to delete data
            beforeSend: function() {
                $("#result1").html("<p class='text-success'> Please wait.. </p>");
            },  

            // on success response
            success:function(response) {
                $("#result1").html(response);
            },

            // error response
            error:function(e) {
                $("#result1").html("Some error encountered, try again");
            }

        });
        $(this).parent().parent().remove(); //deleteing row on which we are aplying delete operation
        }
    }

});



 function save(){ 

     $.ajax({

        url: 'addproduct.php',
        type: 'post',
        data:$('#form1').serialize(),

        beforeSend: function() {
            $("#result").html("<p class='text-success'> Please wait.. </p>");
        },  

        // on success response
        success:function(response) {
            $("#result").html(response);
            $("#form1")[0].reset();
        },

        // error response
        error:function(e) {
            $("#result").html("Some error encountered, try again");
        }

    });

}



function update(){ 

     $.ajax({

        url: 'addproduct.php',
        type: 'post',
        data:$('#form2').serialize(),

        beforeSend: function() {
            $("#result1").html("<p class='text-success'> Please wait.. </p>");
        },  

        // on success response
        success:function(response) {
            $("#result1").html(response);
            
        },

        // error response
        error:function(e) {
            $("#result1").html("Some error encountered, try again");
        }

    });

}
$.validator.addClassRules("update_price", {
     required: true,
     minlength: 2
});