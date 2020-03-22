# CoronaPubQuiz

## Installation
Clone the repo: `git clone git@gitlab.com:swtietz/coronapubquiz.git`

cd into project: `cd CoronaPubQuiz/CoronaPubQuiz`

install npm dependencies: `npm install .`

serve: `ng serve`




Additionally install:
```
npm install -g @angular/cli
npm install -g firebase-tools
```

and do:
```firebase login```

## grundsätzliche Idee
Der Fokus unserer Idee liegt einerseits darauf, zusammen Spaß zu haben und sich auf ein Bier zu treffen, auch wenn man die eigene Wohnung gerade nicht verlassen kann. Dafür werden hier bewusst auch einige "Schwächen" eines Pubquizzes erhalten. Zum Beispiel bekommt der Moderator bewusst keine weitere Möglichkeit, Bilder, Videos und Sound einzublenden oder als Antwort einer Gruppe wird die Antwort gewertet, die zuletzt eingegeben bzw. angewählt wurde, egal durch welchen Teilnehmer des Teams.
Auf der anderen Seite geht es vor allem darum, Geld zur Unterstützung der eigenen Stammkneipe zu sammeln. Daher ist die Benutzeroberfläche so gestaltet, dass sie den Mitspielern möglichst viele Anreize bietet, möglichst viele Getränke zu bestellen. So ist zum Beispiel stets sichtbar, wie viele Getränke welches Team bereits bestellt hat.

## noch nicht umgesetzte Features
Im Rahmen der 48 Stunden waren leider einige Features nicht umsetzbar, die wir gerne noch in den Prototypen eingebaut hätten.
Darunter sind unter anderem:
* aktustisches Feedback beim Bestellen von Getränken (Anstoßgeräusche)
* visuelles Feedback beim Bestellen von Getränken, zum Beispiel als Sprechblase mit "Prost"
* Anzeigen der bestellten Getränke als Strichliste statt als einfache Zahl
* Eingabe eigener Getränke in der "Speisekarte"
* weitere Fragetypen, zum Beispiel Schätzfrage