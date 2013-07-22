var lasRed = 0;
var isOccupied = new Array(9);
var wonBy = new Array(9);
var noOccupied = new Array(9);
for(var i = 0; i<9; i++)
{
	wonBy[i] = 0;
	noOccupied[i] = 0;
	isOccupied[i] = new Array(9);
	for(var j = 0; j<9; j++)
	{
		isOccupied[i][j] = 0;
	}
}
var turn = 0;
$(document).ready(function(e) {
	$("div.cell").on('click', function() {
		var i = parseInt($(this).data("cell").toString().substring(0, 1)) - 1;
		var j = parseInt($(this).data("cell").toString().substring(1, 2)) - 1;
		if( (isOccupied[i][j] == 0) && (wonBy[i] == 0) && ((lasRed == 0) || (lasRed == i + 1)) )
		{
			if(turn == 0)
			{
				this.innerHTML = "O";
				$(this).addClass("blue");
				isOccupied[i][j] = 1;
			}
			else
			{
				this.innerHTML = "X";
				$(this).addClass("red");
				isOccupied[i][j] = 2;
			}
			turn = 1 - turn;
			if(lasRed != 0)
			{
				$("#big" + lasRed).css("border", "2px solid #FFF");
			}
			var whoWon1 = whoWon(isOccupied[i]);
			if(whoWon1 != 0)
			{
				if(whoWon1 == 1)
				{
					$("#big" + (i+1) + " td div.cell").removeClass("red").addClass("blue");
				}
				else
				{
					$("#big" + (i+1) + " td div.cell").removeClass("blue").addClass("red");
				}
				wonBy[i] = whoWon1;
				var gameOver = whoWon(wonBy);
				if(gameOver == 1)
				{
					alert("O won");
					location.reload();
				}
				else if(gameOver == 2)
				{
					alert("X won");
					location.reload();
				}
			}
			noOccupied[i] = noOccupied[i] + 1;
			if( (wonBy[j] == 0) && (noOccupied[j] < 9) )
			{
				lasRed = j + 1;
				$("#big" + lasRed).css("border", "2px solid #F00");
			}
			else
			{
				lasRed = 0;
			}
			
		}
	});
});
function whoWon(arr) {
	if((arr[0] == arr[1]) && (arr[0] == arr[2]) && arr[0])
		return arr[0];
	if((arr[3] == arr[4]) && (arr[3] == arr[5]) && arr[3])
		return arr[3];
	if((arr[6] == arr[7]) && (arr[6] == arr[8]) && arr[6])
		return arr[6];
	if((arr[0] == arr[3]) && (arr[0] == arr[6]) && arr[0])
		return arr[0];
	if((arr[1] == arr[4]) && (arr[1] == arr[7]) && arr[1])
		return arr[1];
	if((arr[2] == arr[5]) && (arr[2] == arr[8]) && arr[2])
		return arr[2];
	if((arr[0] == arr[4]) && (arr[0] == arr[8]) && arr[0])
		return arr[0];
	if((arr[2] == arr[4]) && (arr[2] == arr[6]) && arr[2])
		return arr[2];
	return 0;
}