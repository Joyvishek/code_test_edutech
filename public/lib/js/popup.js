// Get the modal
var modal1 = $('#myModal1');
var modal2 =  $('#myModal2');
var modal3 =  $('#myModal3');
var modal4 = $('#myModal4');
var modal5 = $('#myModal5');
// Get the button that opens the modal
var btn1 = $("#myBtn1");

var btn2 = $("#myBtn2");
var btn3 = $("#myBtn3");
var btn4 = $("#myBtn4");
var btn5 = $("#myBtn5");
// Get the <span> element that closes the modal
var span = $(".close");

// When the user clicks on the button, open the modal 
if(btn1){
$(document).on('click', '#myBtn1', function() {
    $('#myModal1').css("display", "block");
});
}
if(btn2){
$(document).on('click', '#myBtn2', function() {
    $('#myModal2').css("display", "block");
});
}
if(btn3){
$(document).on('click', '#myBtn3', function() {
    $('#myModal3').css("display", "block");
});
}
if(btn4){
$(document).on('click', '#myBtn4', function() {
    $('#myModal4').css("display", "block");
});
}
if(btn5){
$(document).on('click', '#myBtn5', function() {
    $('#myModal5').css("display", "block");
});
}
// When the user clicks on <span> (x), close the modal
$(document).on('click', '.close', function() {
    $("#myModal1").css("display", "none");
    $("#myModal2").css("display", "none");
    $("#myModal3").css("display", "none");
    $("#myModal4").css("display", "none");
    $("#myModal5").css("display", "none");
});

