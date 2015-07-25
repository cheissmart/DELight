var stage = 1;
var board = new Array();
var index = new Array();
var r_size = 5;
var c_size = 5;
var question_size = 5;
var size = r_size * c_size;
var num_on_bulbs = 0;

var bulb_start = new Array();
bulb_start[0] = '<img src="images/off.png" class="bulb" class="off_bulb" id="';
bulb_start[1] = '<img src="images/on.png" class="bulb" class="on_bulb" id="';
var img_end = '/>';

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
            for(var on = 0 ; on < 2 ; on++ )
            {
                index[r][c][on] = idx + "col" + c + '_' + on;
            }
        }
    }


function press( r , c  ){
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

function random_question( q_size ){
    for( var i = 0 ; i < q_size ; i++ )
    {
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
       alert('You Win!  "Genius"');
       random_question( question_size );
   }
}


$(document).ready(function(){
    for( var r = 0 ; r < r_size ; r++ )
    {
        var cur_row = "<tr>";
        for( var c = 0 ; c < c_size ; c++ )
        {
            cur_row += '<td>';

            for( var on = 0 ; on < 2 ; on++ )
                cur_row += bulb_start[on] + index[r][c][on] + '" onclick="once_click(' + r + ',' + c + ')"' + img_end ; 

            cur_row += "</td>" ;
        }
        cur_row += "</tr>";

        $("#Board").append( cur_row );

        for( var c = 0 ; c < c_size ; c++ )
            $( "#" + index[r][c][1] ).toggle();

    }

    while( num_on_bulbs == 0 )
        random_question( question_size );

});
