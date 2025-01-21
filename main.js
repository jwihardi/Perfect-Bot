Game.registerMod("Perfect Bot", {
    init: function() {
        const CLICKS_PER_SECOND = 10;
        const AUTOCLICKER_INTERVAL = 1000 / CLICKS_PER_SECOND;
		const LOGIC_UPDATES_PER_SEC = 4;
		const LOGIC_UPDATE_INTERVAL = 1000 / LOGIC_UPDATES_PER_SEC;
		const NUM_OF_BUILDINGS = 20;
		this.buildings_arr = new Array(NUM_OF_BUILDINGS); /* There are 20 buildings */
	
		
		this.auxiliary_init();

		for(let i = 0; i < 20; i ++){
			console.log(this.buildings_arr[i].amount);
		}
       
	  this.intervalId = setInterval(this.autoclicker, AUTOCLICKER_INTERVAL);
   
	  setInterval(() => {
		this.logic(NUM_OF_BUILDINGS, CLICKS_PER_SECOND);
	}, LOGIC_UPDATE_INTERVAL);
        
    },
	logic: function(num_of_buildings, clicks_per_sec){
		let building_to_buy = this.buying_handler(num_of_buildings, clicks_per_sec);
		if(building_to_buy.canBuy()) building_to_buy.buy();
	},
	buying_handler: function(num_of_buildings, clicks_per_sec){
		/* value = (building-CPS)/ (cost * time-to-afford) | building-CPS is per not total*/
		/* function that calculates the value (to handle buildings and upgrades) */
		function calculate_value(item_cps, item_price){
			return item_cps / ((item_price ** 2) / (Game.cookiesPs + (Game.computedMouseCps * clicks_per_sec))) 
		}

		let curr_value = 0;

		/* calculate values per building */
		let best_building = null;
		for(let i = 0; i < num_of_buildings; i ++){
			let temp_value = calculate_value(this.buildings_arr[i].storedCps, this.buildings_arr[i].price ** 2);
			console.log("value is ", temp_value);
			if(curr_value < temp_value){
				curr_value = temp_value;
				best_building =  this.buildings_arr[i];
			}
		}



		/* calculate values per upgrades (there are a lot of upgrades and different effects they have) */
		let curr_upgrades = Game.UpgradesInStore;
		let best_upgrade = null;
		for(let i = 0; i < curr_upgrades.length; i ++){
		










		}







		return best_building;
	},
	autoclicker: function(){
		Game.ClickCookie();
	},
	get_idle_cps: function(){

	},
	auxiliary_init: function(){
		/* add all 20 buildings to the array */
		this.buildings_arr[0] = Game.Objects['Cursor'];
		this.buildings_arr[1] = Game.Objects['Grandma'];
		this.buildings_arr[2] = Game.Objects['Farm'];
		this.buildings_arr[3] = Game.Objects['Mine'];
		this.buildings_arr[4] = Game.Objects['Factory'];
		this.buildings_arr[5] = Game.Objects['Bank'];
		this.buildings_arr[6] = Game.Objects['Temple'];
		this.buildings_arr[7] = Game.Objects['Wizard tower'];
		this.buildings_arr[8] = Game.Objects['Shipment'];
		this.buildings_arr[9] = Game.Objects['Alchemy lab'];
		this.buildings_arr[10] = Game.Objects['Portal'];
		this.buildings_arr[11] = Game.Objects['Time machine'];
		this.buildings_arr[12] = Game.Objects['Antimatter condenser'];
		this.buildings_arr[13] = Game.Objects['Prism'];
		this.buildings_arr[14] = Game.Objects['Chancemaker'];
		this.buildings_arr[15] = Game.Objects['Fractal engine'];
		this.buildings_arr[16] = Game.Objects['Javascript console'];
		this.buildings_arr[17] = Game.Objects['Idleverse'];
		this.buildings_arr[18] = Game.Objects['Cortex baker'];
		this.buildings_arr[19] = Game.Objects['You'];

		Object.freeze(this.buildings_arr); /* Freeze the array so it is immutable */
	}
});
