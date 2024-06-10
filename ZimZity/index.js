function ZimZity() {

var GridLayout = Packages.android.widget.GridLayout;
var TableLayout = Packages.android.widget.TableLayout;
var TableRow = Packages.android.widget.TableRow;
var LinearLayout = Packages.android.widget.LinearLayout;
var ScrollView = Packages.android.widget.ScrollView;
var Gravity = Packages.android.view.Gravity;
var Toast = android.widget.Toast;
var EditText = Packages.android.widget.EditText;
var TextView = Packages.android.widget.TextView;
var CheckBox = Packages.android.widget.CheckBox;
var LayoutParams = LinearLayout.LayoutParams;
var LayoutInflater = Packages.android.view.LayoutInflater;
var TypedValue = Packages.android.util.TypedValue;

var trace = (msg) => Toast.makeText(Activity.getApplicationContext(), msg.toString(),  Toast.LENGTH_LONG).show();
var log = (msg) => Toast.makeText(Activity.getApplicationContext(), msg.toString(),  Toast.LENGTH_SHORT).show();

 
function panel(orientation) {
	var l = new LinearLayout(Activity.getApplicationContext());
	var params = new LinearLayout.LayoutParams(
	                        LinearLayout.LayoutParams.MATCH_PARENT,
	                        LinearLayout.LayoutParams.WRAP_CONTENT
                            );
	l.setLayoutParams(params);
	l.setOrientation(orientation);
    return l;
	}
 
function horizontalPanel() {
	return panel(LinearLayout.HORIZONTAL);
	}
	
function verticalPanel() {
	return panel(LinearLayout.VERTICAL);
	}
 
function LabeledEdit(label, edit) {
	var l = horizontalPanel();
	var vLabel = new TextView(Activity.getApplicationContext());
	var eEdit = new TextView(Activity.getApplicationContext());
	vLabel.setText(label + ":");
	eEdit.setText(edit);
	l.addView(vLabel);
	l.addView(eEdit);
	this.getL = () => l;
	this.getEdit = () => eEdit;
	}

function WinsView(attack) {
	var l = verticalPanel();
    var tTitle = new TextView(Activity.getApplicationContext());
    tTitle.setBackgroundColor(0x7f7f7fff);
	l.addView(tTitle);
	tTitle.setText("wins");
	
	
	var lLevel = new LabeledEdit("level", attack.wins.level.toString());
	l.addView(lLevel.getL());
	var lPoints = new LabeledEdit("points", attack.wins.weight.toString());
	l.addView(lPoints.getL());
	var lDestroys = new LabeledEdit("destroys", attack.wins.destroys.toString());
	l.addView(lDestroys.getL());
	this.getL = () => l;
	this.getPoints = () => lPoints.getEdit();
	this.getLevel = () => lLevel.getEdit();
	this.getDestroys = () => lDestroys.getEdit();
	}
	
function NeedsView(attack) {
	var l = verticalPanel();
	var tTitle = new TextView(Activity.getApplicationContext());
	tTitle.setText("needs");
	tTitle.setBackgroundColor(0x7f7f7fff);
	l.addView(tTitle);
	var lEnergy = new LabeledEdit("energy", attack.needs.energy.toString());
	l.addView(lEnergy.getL());
	this.getL = () => l;
	this.getEnergy = () => lEnergy.getEdit();
	var lObjects = {};
	for(var key in  attack.needs.objects) {
		lObjects[key] = new LabeledEdit(key,  attack.needs.objects[key].toString());
		l.addView(lObjects[key].getL());
		}
	}

var strategies = [];

function checkedCalculation(w) {
       	try {
       	 var points = 0;
            var energy = 0;
            var destroys = 0;
            var objects = {};
            var s = "";
            strategies.forEach((strategy, i) => {
            	if (strategy.isChecked()) {
            	    var count = strategy.getCount();
            	    points += count*attacks[i].wins.weight;
                    destroys += count*attacks[i].wins.destroys;
                    energy += count*attacks[i].needs.energy;
                    for(var object in attacks[i].needs.objects) {
                       if (!objects[object]) objects[object] = 0;
                       objects[object] += count*attacks[i].needs.objects[object];
                       }
                    strategy.getEName().setEnabled(false);
            	 } else {
            	    strategy.getEName().setEnabled(true);
            	 }
            	});
            s = "points:" + points + " destroys:" + destroys;
            s += " energy:" + energy;
            var i = 0;
            for(var object in objects) {
            	s+= ((i++%2)?"  ":"\n") + object + ":" + objects[object];
            	}
            t.setText(s);
        
        } catch (e) {
        	Activity.reportError(e.toSource() +"::"+ e.stackTrace());
        	}
         }

function Strategy(attack) {
	//trace("attack::'" +  JSON.stringify(attack) + "'");

	

    // Main panel for Strategy
	this.l = new TableRow(Activity.getApplicationContext()); //horizontalPanel();
	
	
	params = new TableRow.LayoutParams(
	                        TableRow.LayoutParams.WRAP_CONTENT,
	                        TableRow.LayoutParams.WRAP_CONTENT,
	                        1.0
                            );
     
	
	var lName = horizontalPanel();
	lName.setLayoutParams(params);
	lName.setBackgroundColor(0x7f7f7fff);
	var cbName = new CheckBox(Activity.getApplicationContext());
    cbName.setText(attack.name);
    cbName.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
    cbName.setOnCheckedChangeListener(checkedCalculation);
    var eName = new EditText(Activity.getApplicationContext());
    eName.setText("1");
    
    lName.addView(eName);
    lName.addView(cbName);
    this.l.addView(lName);
    
    
    var vWins = new WinsView(attack);
    var lWins = vWins.getL();
    lWins.setLayoutParams(params);
    this.l.addView(lWins);
    
    
    var vNeeds = new NeedsView(attack);
    var lNeeds = vNeeds.getL();
    lNeeds.setLayoutParams(params);
    this.l.addView(lNeeds);
    
    
    this.getL = function() { return this.l; }
    
    this.isChecked = function() {
    	return cbName.isChecked();
    	}
    
    this.getCount = function() {
    	var s = eName.getText();
    	return parseInt(s);
    	}
    
    this.getEName = () => eName;
	}

var s = String("Calcul de strategie");
var ll = new Packages.android.widget.LinearLayout(Activity.getApplicationContext());
ll.setOrientation(Packages.android.widget.LinearLayout.VERTICAL);
var b = new android.widget.Button(Activity.getApplicationContext());
var t = new android.widget.TextView(Activity.getApplicationContext());
       b.setText(s)
       
       
       Activity.setContentView(ll);
       t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20);
       t.setBackgroundColor(Packages.android.graphics.Color.rgb(0,0,0));
       t.setTextColor(Packages.android.graphics.Color.rgb(0,255, 0));
       t.setGravity(Gravity.CENTER);
       
       ll.addView(t);;
      // ll.addView(b);
       
       
       var tableParams = new TableLayout.LayoutParams(TableLayout.LayoutParams.WRAP_CONTENT, TableLayout.LayoutParams.WRAP_CONTENT);
       var rowParams = new TableRow.LayoutParams(TableRow.LayoutParams.WRAP_CONTENT, TableRow.LayoutParams.WRAP_CONTENT);

       var tableLayout = new TableLayout(Activity.getApplicationContext());
       tableLayout.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT));
       tableLayout.setStretchAllColumns(true);
       tableLayout.setShrinkAllColumns(true);

       var scrollView = new ScrollView(Activity.getApplicationContext());
       scrollView.addView(tableLayout);

        ll.addView(scrollView);
       
       // Loading attacks
      var fJsonAttacks = Lourah.jsFramework.dir() + "/allAttacks.json";
      var jsonAttacks = Activity.path2String(fJsonAttacks);
      var allAttacks = JSON.parse(jsonAttacks);

       attacks = [];
       for(var city in allAttacks) {
         allAttacks[city].forEach(rough => {
                
                attack = {
                    name: city + "." + rough[0],
                    wins: {
                    	weight: rough[1],
                        level: rough[2],
                        destroys: rough[3]
                    	},
                    needs: {
                    	energy: rough[4],
                        objects: rough[5]
                    	}
                    };
                    
                attacks.push(attack);
                });
       }
       
       
       attacks.sort(function(a,b) {
       	var aoc = 0;
           var boc = 0;
       	for (var o in a.needs.objects) {
       	   aoc += a.needs.objects[o];
       	}
           for (var o in b.needs.objects) {
         	boc += b.needs.objects[o];
           }
       	var cmp =
                (a.needs.energy - b.needs.energy)
             || (aoc - boc)
             || (a.wins.destroys - b.wins.destroys)
             || (b.wins.weight - a.wins.weight)
                ;
           return cmp;
       });
       

       
       attacks.forEach(attack => {
       	 var strategy = new Strategy(attack);
       	 strategies.push(strategy);
            tableLayout.addView(strategy.getL())
            });
            
              
       Activity.setTitle('ZimZity  by Lourah ');
       var i = 0;
       
       //b.setOnClickListener(checkedCalculation);
}

ZimZity();
