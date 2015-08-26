var stage;
var board;
var index;
var r_size;
var c_size;
var question_size;
var size;
var num_on_bulbs;
var node_list;
var base;

var bulb_start = new Array();
bulb_start[0] = '<img src="images/off.png" class="bulb" class="off_bulb" id="';
bulb_start[1] = '<img src="images/on.png" class="bulb" class="on_bulb" id="';
var img_end = '/>';

/*
var stage = 1;
var board = new Array();
var index = new Array();
var r_size = 5;
var c_size = 5;
var question_size = 5;
var size = r_size * c_size;
var num_on_bulbs = 0;
var node_list = new Array();
var base = ( r_size > c_size ) ? r_size : c_size ;

for (var r = 0; r < r_size; ++r) {
        board[r]= new Array();
        index[r] = new Array()
        var idx = 'row' + r;
        for( var c = 0 ; c < c_size ; ++c){
            node_list[ r * c_size + c ] = ( r * base + c  );
            board[r][c] = false;
            index[r][c] = new Array();
            for(var on = 0; on < 2; on++) {
                index[r][c][on] = idx + "col" + c + '_' + on;
            }
        }
}
*/
function in_range(r, c) {
    return r >= 0 && r < r_size && c >= 0 && c < c_size;
}

function press(r, c){
        for(var i = r-1 ; i <= (r+1) ; i++ ){
            if( i >= 0 && i < r_size){
                for(var j = c-1 ; j <= (c+1) ; j++ ){
                    if( j >= 0 && j < c_size ){
                        board[i][j] = !board[i][j];
                        for(var on = 0; on < 2 ; on++ )
                            $( "#" + index[i][j][on] ).toggle();
                        if(board[i][j]){
                            num_on_bulbs++;
                        }
                        else{
                            num_on_bulbs--;
                        }
                    }
                }
            }
        }
    }

function float2int( val ){
    return val | 0;
}

function random_question(q_size){
    for (var i = 0; i < q_size; i++) {
        var rn = i + float2int( Math.random() * ( size - i ) ) ;
        var t = node_list[i] ;
        node_list[i] = node_list[rn] ;
        node_list[rn] = t;

        press( float2int( node_list[i] / base ) , node_list[i] % base );
    }

    $("#stage").text("Stage " + (stage++) );
}

function once_click( r , c)
{
   press( r , c );
   $("#pop")[0].play();
   if(num_on_bulbs==0){
       swal({
            title: '<span style = " background-color: #FC0A20; color: #FFFFFF; margin:2px auto;  ">  <small><img src="images/neutral-indeed-small.png"> Well done, Tommy Atkins! &nbsp;&nbsp;&nbsp; </small> </span>',
            text: '<img src="images/Keep-calm-and-carry-on-scan.jpg" height="288" width="192" >',
            confirmButtonColor: '#FC0A20',
            confirmButtonText: 'Yes, Milord!',
            html: true
       });
       random_question( question_size );
   }
}

function square_color_fill(r, c, color) {
    for(var i = r - 1; i <= r + 1; i++) {
        for (var j = c - 1; j <= c + 1; j++) {
            if (in_range(i, j)) {
                for(var on = 0; on < 2; on++) {
                    $('#' + index[i][j][on]).css('background-color', color);
                }
            }
        }
    }
}

function init(row_num, col_num, q_num) {
    r_size = row_num;
    c_size = col_num;
    stage = 1;
    board = new Array();
    index = new Array();
    size = r_size * c_size;
    question_size = float2int(q_num / 20 * size) + 1;
    num_on_bulbs = 0;
    node_list = new Array();
    base = ( r_size > c_size ) ? r_size : c_size ;
    for (var r = 0; r < r_size; ++r) {
        board[r]= new Array();
        index[r] = new Array()
        var idx = 'row' + r;
        for( var c = 0 ; c < c_size ; ++c){
            node_list[ r * c_size + c ] = ( r * base + c  );
            board[r][c] = false;
            index[r][c] = new Array();
            for(var on = 0 ; on < 2 ; on++ )
            {
                index[r][c][on] = idx + "col" + c + '_' + on;
            }
        }
    }
}

function build_board(row_num, col_num) {
    init(row_num, col_num, q_num);
    $("#Board").empty();
    for (var r = 0; r < r_size; r++) {
        var cur_row = "<tr>";
        for (var c = 0; c < c_size; c++) {
            cur_row += '<td>';

            for( var on = 0 ; on < 2 ; on++ )
                cur_row += bulb_start[on] + index[r][c][on] + '" ' +
                    'onclick    ="once_click('+r+','+c+')" ' +
                    'onmouseover="square_color_fill('+r+','+c+','+"'#BCF5A9'"+')" ' +
                    'onmouseout ="square_color_fill('+r+','+c+','+"'pink'" + ')" ' +
                    img_end ; 

            cur_row += "</td>" ;
        }
        cur_row += "</tr>";
        $("#Board").append( cur_row );
        for( var c = 0 ; c < c_size ; c++ )
            $("#" + index[r][c][1]).toggle();

    }
}


$(document).ready(function(){

//preload images
var images  = [
    "images/Keep-calm-and-carry-on-scan.jpg",
    "images/neutral-indeed-small.png"
];
var image_url;
for( image_url in images ){
    var img = new Image(0,0);
    img.src = image_url;
}
    

    build_board(5, 5);
    while(num_on_bulbs == 0)
        random_question(question_size);

    $('#set').click(function(){
        var row_num = parseInt($('#row_num').val(), 10);
        var col_num = parseInt($('#col_num').val(), 10);
        var q_num = parseInt($('#q_num').val(), 10);
        if (isNaN(row_num) || isNaN(col_num) || isNaN(q_num)) {
            swal({
                title: 'Error',
                text: 'Integers only.',
                type: 'error'
            });
        } else if (row_num < 3 || col_num < 3 || q_num < 1 || q_num > 10) {
            swal({
                title: 'Error',
                text: 'Note the input range.',
                type: 'error'
            });
        } else {
            build_board(row_num, col_num, q_num);
            while (num_on_bulbs == 0)
                random_question(question_size);
        }
    });

});
