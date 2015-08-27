var stage;
var board;
var index;
var r_size;
var c_size;
var question_size;
var size;
var num_on_bulbs;
var pos_list; // list of pos to be shuffled by the question generator
var base;
var cur_timer; 
var cur_s;
var cur_m;
var first_press;

var bulb_start = new Array();
bulb_start[0] = '<img src="images/off.png" class="bulb" class="off_bulb" id="';
bulb_start[1] = '<img src="images/on.png" class="bulb" class="on_bulb" id="';
var img_end = '/>';

function float2int( val ){
    return val | 0;
}

function init(row_num, col_num, q_num) {
    r_size = row_num;
    c_size = col_num;
    stage = 1;
    board = new Array();
    index = new Array();
    size = r_size * c_size;
    question_size = float2int(q_num / 20 * size);
    if(question_size < 1)
        question_size = 1;
    num_on_bulbs = 0;
    pos_list = new Array();
    base = ( r_size > c_size ) ? r_size : c_size ;
    for (var r = 0; r < r_size; ++r) {
        board[r]= new Array();
        index[r] = new Array()
        var idx = 'row' + r;
        for( var c = 0 ; c < c_size ; ++c){
            pos_list[ r * c_size + c ] = ( r * base + c  );
            board[r][c] = false;
            index[r][c] = new Array();
            for(var on = 0 ; on < 2 ; on++ )
            {
                index[r][c][on] = idx + "col" + c + '_' + on;
            }
        }
    }
}

function in_range(r, c) {
    return r >= 0 && r < r_size && c >= 0 && c < c_size;
}

function isDigit(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == "") {
        return false;
    } else {
        return true;
    }
}

function timer() {
    cur_s++;
    if (cur_s == 60) {
        cur_m++;
        cur_s = 0;
    }
    $("#time").text(cur_m +':'+ ((cur_s<10)?'0':'') + cur_s);
}

function comment(m, s) {
    s = m * 60 + s;
    var ratio = question_size / 5;
    s /= ratio;
    if (s <= 3)
        return 'Genius';
    else if(s <= 6)
        return 'Great';
    else if(s <= 15)
        return 'Medium';
    else if(s <= 20)
        return 'Bad';
    else
        return 'Practice Moar!';
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

function random_question(q_size){
    first_press = false;
    $("#time").text('0:00');
    for (var i = 0; i < q_size; i++) {
        var rn = i + float2int( Math.random() * ( size - i ) ) ;
        var t = pos_list[i] ;
        pos_list[i] = pos_list[rn] ;
        pos_list[rn] = t;

        press( float2int( pos_list[i] / base ) , pos_list[i] % base );
    }

    $("#stage").text("Stage " + (stage++) );
    first_press = true;
}

function on_click( r , c)
{
    if (first_press) {
        first_press = false;
        cur_s = 0;
        cur_m = 0;
        cur_timer = setInterval(function () {timer()}, 1000);
    }
    press(r, c);
    $("#pop")[0].play();
    if (num_on_bulbs == 0) {
       clearInterval(cur_timer);
       swal({
            title: '<span style = " background-color: #FC0A20; color: #FFFFFF; margin:2px auto;  ">  <small><img src="images/neutral-indeed-small.png"> Well done, Tommy Atkins! &nbsp;&nbsp;&nbsp; </small> </span>',
            text: '<img src="images/Keep-calm-and-carry-on-scan.jpg" height="288" width="192" > <br>' +
                  '<h3>Time Spent - ' + $('#time').text() + ', ' + comment(cur_m, cur_s) + '</h3>',
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

function build_board(row_num, col_num, q_num) {
    init(row_num, col_num, q_num);
    $("#Board").empty();
    for (var r = 0; r < r_size; r++) {
        var cur_row = "<tr>";
        for (var c = 0; c < c_size; c++) {
            cur_row += '<td>';

            for( var on = 0 ; on < 2 ; on++ )
                cur_row += bulb_start[on] + index[r][c][on] + '" ' +
                    'onclick    ="on_click('+r+','+c+')" ' +
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
    var row_num = 5;
    var col_num = 5;
    var q_num = 4;
    build_board(row_num, col_num, q_num);
    while(num_on_bulbs == 0)
        random_question(question_size);

    $('#set').click(function(){
        row_num = $('#row_num').val();
        col_num = $('#col_num').val();
        q_num = $('#q_num').val();
        if (!isDigit(row_num) || !isDigit(col_num) || !isDigit(q_num)) {
            swal({
                title: 'Error',
                text: 'Positive Integers only.',
                type: 'error'
            });
        } else {
            row_num = parseInt(row_num, 10);
            col_num = parseInt(col_num, 10);
            q_num = parseInt(q_num, 10);
            if (row_num < 3 || col_num < 3 || q_num < 1 || q_num > 10) {
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
        }
    });

});
