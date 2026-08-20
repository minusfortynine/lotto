program Lotto;

const
  HowMany = 6;
  OutOf   = 45;
  Draws   = 3;
  MaxPool = 49;   { big enough for 6/45 or 6/49 }

type
  TIntArray = array[1..MaxPool] of Integer;

var
  Lucky : TIntArray;
  i, d  : Integer;

{ Simple bubble sort for the small lucky-number array }
procedure SortNumbers(var A: TIntArray; Count: Integer);
var
  i, j, Temp: Integer;
begin
  for i := 1 to Count - 1 do
    for j := 1 to Count - i do
      if A[j] > A[j + 1] then
      begin
        Temp     := A[j];
        A[j]     := A[j + 1];
        A[j + 1] := Temp;
      end;
end;

{ Pick HowMany unique numbers from 1..OutOf }
procedure GenerateLotto(HowMany, OutOf: Integer; var Lucky: TIntArray);
var
  Pool      : TIntArray;
  Remaining, i, j, Idx: Integer;
begin
  { fill the pool 1, 2, 3, ... OutOf }
  for i := 1 to OutOf do
    Pool[i] := i;

  Remaining := OutOf;

  for i := 1 to HowMany do
  begin
    Idx := Random(Remaining) + 1;   { 1-based random index }
    Lucky[i] := Pool[Idx];

    { remove the chosen number by shifting the rest left }
    for j := Idx to Remaining - 1 do
      Pool[j] := Pool[j + 1];

    Dec(Remaining);
  end;

  SortNumbers(Lucky, HowMany);
end;

begin
  Randomize;   { seed the random generator once }

  for d := 1 to Draws do
  begin
    GenerateLotto(HowMany, OutOf, Lucky);

    Write('Draw ', d, ': ');
    for i := 1 to HowMany do
    begin
      Write(Lucky[i]);
      if i < HowMany then Write(' ');
    end;
    Writeln;
  end;

  Write('Press Enter...');
  Readln;
end.
