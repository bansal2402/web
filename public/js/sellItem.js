


function readUrl(input){
    if(input.files&& input.files[0])
    {
        input_filesList = [];
        
        for (const element in input.files) {
            console.log(element);
            input_filesList[element] = input.files[element];
        }
        console.log(input_filesList);

        for(i=0;i<input_filesList.length;i++){
            console.log(i);
            var reader=new FileReader();
            reader.onload=function (e){
                
                $("#preview").append(`<div class="d-inline-block"><form action="destroy"><div style="position:relative;"><button type="submit"   id="closebutton" class="close AClass round">&times;</button><img src="${e.target.result}" class="img_preview"></div></form></div>`
                );


            }

            reader.readAsDataURL(input.files[i]);

        }
        
    }

    
}

$("#img").change(function (e){
    readUrl(this);
});


$('body').on('click', '#closebutton', function(e){
    e.preventDefault();
    $(this).parent().remove();

});




