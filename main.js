Game.registerMod("Perfect Bot", {
    init: function() {
		const CLICKS_PER_SECOND = 10;
        const AUTOCLICKER_INTERVAL = 1000 / CLICKS_PER_SECOND;
		const DELTA_CLICKS_PER_SEC = 2;
		const LOGIC_UPDATES_PER_SEC = 4;
		const LOGIC_UPDATE_INTERVAL = 1000 / LOGIC_UPDATES_PER_SEC;
		const NUM_OF_BUILDINGS = 20;
		const NUM_OF_ASCENSIONS = 20;
		this.buildings_arr = new Array(NUM_OF_BUILDINGS); /* There are 20 buildings */
		this.logic_achievements = new Map(); /* Achievements that require alterting the logic to obtain */
		this.heavenly_upgrades = new Map(); /* contains all the heavenly upgrade ID's */
		this.ascension_milestones = new Array(NUM_OF_ASCENSIONS);
		this.curr_num_of_ascensions = 0;
		

		this.auxiliary_init();
		
		this.intervalId = setInterval(this.autoclicker, AUTOCLICKER_INTERVAL + (Math.random() * 2 - 1) * DELTA_CLICKS_PER_SEC); /* not robotic clicking */
		
		setInterval(() => {
			this.logic(NUM_OF_BUILDINGS, CLICKS_PER_SECOND);
		}, LOGIC_UPDATE_INTERVAL);

		setInterval(() => {
			this.ascend_precisely();
		}, 200);
        
    },
	logic: function(num_of_buildings, clicks_per_sec){
		/* auto buying */
		let item_to_buy = this.buying_handler(num_of_buildings, clicks_per_sec);
		if(item_to_buy.getPrice() <= Game.cookies) item_to_buy.buy(); /* buy the best valued item once we can afford it */
		if(this.logic_achievements.get("fading luck")) this.golden_cookie_clicker();
		/* achievements */
		//	this.achievement_handler();


	},
	achievement_handler: function(){
		this.update_achievement_status();



		/* START OF HANDLING FREE ACHIEVEMENTS */
		function get_tabloid_addiction(){
			if(this.tabloidAdditionInProgress) return;
			this.tabloidAdditionInProgress = true;
			for(let i = 0; i < 50; i ++){
				document.querySelector("#commentsText1").click();
			}
			this.tabloidAdditionInProgress = false;
		}

		function get_god_complex(){
			if(this.godComplexInProgress) return;
			this.godComplexInProgress = true;
			Game.bakeryNameSet("orteil");
			Game.bakeryNameSet("perfect bot");
			this.godComplexInProgress = false;
		}

		function get_olden_days(){
			if(this.oldenDaysInProgress) return;
			this.oldenDaysInProgress = true;
			document.querySelector("#logButton").click();
			let small_cookie = document.querySelector("#oldenDays > div");
			if(small_cookie) small_cookie.click();
			document.querySelector("#logButton").click();
			this.oldenDaysInProgress = false;
		}

		function get_whats_in_a_name(){
			if(this.whatsInANameInProgress) return;
			this.whatsInANameInProgress = true;
			document.querySelector("#bakeryName").click();
			Game.ConfirmPrompt();
			this.whatsInANameInProgress = false;
		}

		function get_here_you_go_and_tiny_cookie(){
			if (this.statsMenuInProgress) return;
			this.statsMenuInProgress = true;
			document.querySelector("#statsButton").click();
			let error_button = document.querySelector("#statsAchievs > div.listing.crateBox > div:nth-child(542)");
			let tiny_cookie = document.querySelector("#statsGeneral > div:nth-child(1) > div > div");
			if(tiny_cookie) tiny_cookie.click();
			if(error_button) error_button.click();
			document.querySelector("#statsButton").click();
			this.statsMenuInProgress = false;
		}

		function get_stifling_the_press(){
			if (this.stiflingThePressInProgress) return;  
			this.stiflingThePressInProgress = true;

			let previous_width = window.innerWidth;
			window.innerWidth = 200;
			Game.resize();
			document.querySelector("#commentsText1").click();
			window.innerWidth = previous_width;
			Game.resize();

			this.stiflingThePressInProgress = false;
		}

		async function get_cookie_dunker(){
			// height 50, width 200
			if(Game.milkProgress < 0.4) return;

			if (this.cookieDunkerInProgress) return;  
			this.cookieDunkerInProgress = true;

			let original_window_height = window.innerHeight;
			let original_window_width = window.innerWidth;
			window.innerWidth = window.innerWidth / 2;
			window.dispatchEvent(new Event('resize'));
			for(let i = 3; i >= 0; i ++){
				window.innerHeight = window.innerHeight / 2;
				window.dispatchEvent(new Event('resize'));
				await new Promise(resolve => setTimeout(resolve, 5000));
				if(Game.Achievements['Cookie-dunker'].won) break;
			}
			window.innerHeight = original_window_height;
			window.innerWidth = original_window_width;
			window.dispatchEvent(new Event('resize'));
			this.cookieDunkerInProgress = false;
		}

		const get_free_achievements = () =>{

			if(this.getFreeAchievements) return;
			this.getFreeAchievements = true;
			/* timeoutes are so you don't get 6 achievements at once even though they are really easy */
			/* if statements double check with the one around get_free_achievements incase of errors */

			/*								logs to debug 						*/
			/*
			console.log("=====================================================");
			console.log("tabloid addiction: ", this.logic_achievements.get('tabloid addiction'));
			console.log("change name ", this.logic_achievements.get("change name"));
			console.log("god complex ", this.logic_achievements.get("god complex"));
			console.log("olden days ", this.logic_achievements.get("olden days"));
			console.log("tiny cookie ", this.logic_achievements.get("tiny cookie"));
			console.log("error ", this.logic_achievements.get("error"));
			console.log("small news ", this.logic_achievements.get("small news"));
			console.log("cookie dunker ", this.logic_achievements.get("cookie dunker"));
			console.log("=====================================================");
			*/

			if(!this.logic_achievements.get("tabloid addiction")) get_tabloid_addiction(); 
			if(this.logic_achievements.get("god complex")){
				if(!this.logic_achievements.get("change name")) setTimeout(() => {get_whats_in_a_name();}, 5000);
			}
			if(!this.logic_achievements.get('god complex')) setTimeout(() => {get_god_complex();}, 20000);
			if(!this.logic_achievements.get("olden days")) setTimeout(() => {get_olden_days();}, 4000);
			if(!this.logic_achievements.get("error") || !this.logic_achievements.get("tiny cookie")) setTimeout(() => {get_here_you_go_and_tiny_cookie();}, 10000);
			if(!this.logic_achievements.get("small news")) setTimeout(() => {get_stifling_the_press();}, 20000);
			if(!this.logic_achievements.get("cookie dunker")) get_cookie_dunker();
			this.getFreeAchievements = false;
		};

		const has_free_achievements = () =>{
			return this.logic_achievements.get('tabloid addiction') && this.logic_achievements.get("change name") && this.logic_achievements.get('god complex')
				&& this.logic_achievements.get("olden days") && this.logic_achievements.get("error") && this.logic_achievements.get("tiny cookie")
				&& this.logic_achievements.get("small news") && this.logic_achievements.get("cookie dunker");
		};

		if(!has_free_achievements()) {
			console.log("get free achievements: ", has_free_achievements());
			get_free_achievements();
		}
		

		/* END OF HANDLING FREE ACHIEVEMENTS */

		const get_just_wrong = () =>{
			/* index 1 is the grandma object (they're in order) */
			if(!this.logic_achievements.get("just wrong") && this.buildings_arr[1].amount > 0) this.buildings_arr[1].sell(1); 
		};

		const get_fading_luck = () =>{
			if(this.logic_achievements.get("fading luck")) return;
			if(Game.shimmers[0]){
				console.log("time to die ", Game.shimmers[0].life/Game.fps);
				if(Game.shimmers[0].life/Game.fps < 1){
					console.log("clicked on ", Game.shimmers[0].life/Game.fps);
					// #shimmers > div


					 Game.shimmers[0].pop();
				}
			}
		};

		get_fading_luck();
		get_just_wrong();

		

	},
	buying_handler: function(num_of_buildings, clicks_per_sec){
		/* value = (building-CPS)/ (cost * time-to-afford) | building-CPS is per not total*/
		/* function that calculates the value (to handle buildings and upgrades) */
		function calculate_value(item_cps, item_price, idle_cps, mouse_cps){
			return item_cps / ((item_price ** 2) / (idle_cps + (mouse_cps * clicks_per_sec)));
		}

		let curr_value = 0;
		/* calculate values per building */
		let best_purchase = null;
		for(let i = 0; i < num_of_buildings; i ++){
			let temp_value = calculate_value(this.buildings_arr[i].storedCps, this.buildings_arr[i].getPrice(), Game.cookiesPs, Game.computedMouseCps);
			if(curr_value <= temp_value){
				curr_value = temp_value;
				best_purchase =  this.buildings_arr[i];
			}
		}


		/* calculate values per upgrades (there are a lot of upgrades and different effects they have) */
		let curr_upgrades = Game.UpgradesInStore;
		for(let i = 0; i < curr_upgrades.length; i ++){
			let original_mouse_cps = Game.computedMouseCps;
			let original_idle_cps = Game.cookiesPs;
			curr_upgrades[i].bought = 1; /* Kind of buys it, but doesn't remove from the store or give achievements */
			Game.CalculateGains(); /* recalculate the CPS otherwise it will take a while */
			let delta_mouse_cps = Game.computedMouseCps - original_mouse_cps;
			let delta_idle_cps = Game.cookiesPs - original_idle_cps;
			let temp_value = calculate_value(delta_idle_cps + (delta_mouse_cps * clicks_per_sec), curr_upgrades[i].getPrice(), original_idle_cps, original_mouse_cps);
			curr_upgrades[i].bought = 0;
			Game.CalculateGains();

			if(curr_value <= temp_value){
				curr_value = temp_value;
				best_purchase = curr_upgrades[i];
			}
		}
		
		// console.log("Best option is ", best_purchase.name);
		return best_purchase;
	},
	ascend_precisely: function(){
		/* This function gets called many more times than logic */
		/* This is so it can ascend at the exact right value */
		const ascend_now = () =>{
			this.ascending = true;
			Game.Ascend();
			Game.ConfirmPrompt();
			console.log("ascended");
		
		}
		let meter = Game.ascendMeterLevel + Game.heavenlyChips;

		console.log("what ascension ", this.get_recalculated_num_of_ascensions());


		if(!this.ascending){
			let ascension_count = this.get_recalculated_num_of_ascensions();
			if(ascension_count >= 0 && meter >= this.ascension_milestones[ascension_count]) ascend_now();
		}
		if(this.ascending && Game.OnAscend) this.ascending_handler(this.get_recalculated_num_of_ascensions());
	},
	ascending_handler: function(curr_num_of_ascensions){
		/* following https://cookieclicker.wiki.gg/wiki/Ascension_guide */
		/* first ascension 365 */
		/* second ascension 2185 */
		/* third ascension 12,301 */
		let heavenly_upgrades_to_buy = []

		const reincarnate = () => {
			Game.Reincarnate();
			Game.ConfirmPrompt();
			this.ascending = false;
		}

		const unlock_heavenly_upgrades = () => {
		//	console.log("Game.heavenlyChips ", Game.heavenlyChipsDisplayed);
			for(let i = 0; i < heavenly_upgrades_to_buy.length; i ++){
				Game.Upgrades[heavenly_upgrades_to_buy[i]].buy();
			}
		//	console.log("chips after ", Game.heavenlyChips);
		}

		const ascension_functions = [
			() => {
				if(!Game.OnAscend) return;
				heavenly_upgrades_to_buy = ['Legacy', 'Heavenly cookies', 'How to bake your dragon', 
				'Heavenly luck', 'Permanent upgrade slot I', 'Heralds', 
				'Box of brand biscuits', 'Tin of british tea biscuits', 'Box of macarons'];
				console.log("ascension 1");

			},
			() => {
				if(!Game.OnAscend) return;
				heavenly_upgrades_to_buy = ['Season switcher', 'Golden switch', 'Tin of butter cookies', 'Starter kit'];
				console.log("ascension 2");

			},
			() => {
				if(!Game.OnAscend) return;
				heavenly_upgrades_to_buy = ['Persistent memory', 'Halo gloves', 'Lasting fortune', 'Decisive fate', 
				'Lucky digit', 'Starter kitchen'];
				console.log("ascension 3");
				
			}
		];

		if(curr_num_of_ascensions >= 0 && curr_num_of_ascensions < ascension_functions.length) ascension_functions[curr_num_of_ascensions]();
		
		if(heavenly_upgrades_to_buy.length > 0){
			unlock_heavenly_upgrades();
			console.log("curr ", curr_num_of_ascensions, " length ", ascension_functions.length);
			reincarnate();
		}else{
			console.log("unlock_heavenly_upgrades is null");
		}
		
	},
	get_recalculated_num_of_ascensions: function(){
		/* This is a lot of hardcoded code, but it is to ensure correct ascensions accounting for "user error" */
		/* It accounts for if the user is not on a fresh run and has ascended, otherwise we could use Game.resets */

		 /* obviously there cannot be "user error" if there has been no ascensions */
		 /* if no heavenlychips we spent then no upgrades were purchased either */
		const is_bought = (upgrade_name) => {
			return Game.Upgrades[upgrade_name].bought;
		}

		/* To shorten code, only the end nodes will be considered, since you can't unlock them without unlocking the parent nodes */
		/* going from last ascension -> first ascension */

		if(Game.heavenlyChipsSpent === 74938145064647550) return -1; /* all heavenly upgrades bought */

		if(Game.heavenlyChipsSpent === 270362326214 || (is_bought('Fortune cookies') && is_bought('Permanent upgrade slot V')
			&& is_bought('Pet the dragon'))
		) return 12;

		if(Game.heavenlyChipsSpent === 42584548438 || (is_bought('Cat ladies') && is_bought('Kitten wages')
			&& is_bought('Reinforced membrane') && is_bought('Keepsakes'))
		) return 11;

		/* account for if something goes wrong and we don't have four 7's */
		if(Game.heavenlyChipsSpent ===  7473437343 || Game.heavenlyChipsSpent === 7395659566 && (is_bought('Unshackled grandmas')
			&& is_bought('Unshackled berrylium') && is_bought('Sugar aging process') && is_bought('Aura gloves'))
		) return 10;

		if(Game.heavenlyChipsSpent === 1809910651 || (is_bought('Stevia Caelestis') && is_bought('Sugar crystal cookies')
			&& is_bought('Permanent upgrade slot IV'))
		) return 9;

		/* account for if something goes wrong and we don't have two 7's */
		if(Game.heavenlyChipsSpent === 109910651 || Game.heavenlyChipsSpent === 109910574 
			|| (is_bought('Heavenly luck') && is_bought('Starspawn') && is_bought('Starsnow') 
			&& is_bought('Starterror') && is_bought('Starlove') && is_bought('Startrade')
			&& is_bought('Chimera') && is_bought('Golden cookie alert sound') && is_bought('Fanciful dairy selection') 
			&& is_bought('Distinguished wallpaper assortment') && is_bought('Wrinkly cookies'))
		) return 8; 

		if(Game.heavenlyChipsSpent === 36420889 || (is_bought('Unshackled cursors'))) return 7;
		
		if(Game.heavenlyChipsSpent === 3520889 || (is_bought('Synergies Vol. II') && is_bought('Beelzebub')
			&& is_bought('Seraphim'))
		) return 6;

		if(Game.heavenlyChipsSpent === 1029755 || (is_bought('Divine bakeries') && is_bought('Kitten angels')
			&& is_bought('Satan') && is_bought('Synergies Vol. I'))
		) return 5;

		if(Game.heavenlyChipsSpent === 192935 || (is_bought('Residual luck') && is_bought('Permanent upgrade slot II'))
		) return 4;

		if(Game.heavenlyChipsSpent === 72936 || (is_bought('Starter kitchen') && is_bought('Halo gloves')
			&& is_bought('Lasting fortune') && is_bought('Lucky digit') && is_bought('Decisive fate') 
			&& is_bought('Persistent memory'))
		) return 3;

		if(Game.heavenlyChipsSpent === 2550 || (is_bought('Season switcher') && is_bought('Golden switch')
			&& is_bought('Butter cookies') && is_bought('Starter kit'))
		) return 2;

		if(Game.heavenlyChipsSpent === 365 || (is_bought('Box of brand biscuits')
			&& is_bought('British tea biscuits') && is_bought('Macaroons') && is_bought('Heavenly luck')
			&& is_bought('Permanent upgrade slot I') && is_bought('Heralds') && is_bought('How to bake your dragon'))
		) return 1;

		if(Game.resets === 0 || Game.heavenlyChipsSpent === 0) return 0;
	},
	golden_cookie_clicker: function(){
		let curr_cookies = Game.shimmers;
		if(Game.shimmers[0]) console.log("fading luck is ", this.logic_achievements.get("fading luck"));
		for(let i = 0; i < curr_cookies.length; i ++){
			if(curr_cookies[i].type === 'golden' && curr_cookies[i].wrath === 0) curr_cookies[i].pop();
		}
	},
	autoclicker: function(){
		Game.ClickCookie();
	},
	update_achievement_status: function(){
		/* free beginning achievements */
		this.logic_achievements.set("tabloid addiction", Game.Achievements['Tabloid addiction'].won);
		this.logic_achievements.set("god complex", Game.Achievements['God complex'].won);
		this.logic_achievements.set("olden days", Game.Achievements['Olden days'].won);
		this.logic_achievements.set("change name", Game.Achievements['What\'s in a name'].won);
		this.logic_achievements.set("error", Game.Achievements['Here you go'].won);
		this.logic_achievements.set("tiny cookie", Game.Achievements['Tiny cookie'].won);
		this.logic_achievements.set("cookie dunker", Game.Achievements['Cookie-dunker'].won);
		this.logic_achievements.set("small news", Game.Achievements['Stifling the press'].won);

		/* easy achievements */

		this.logic_achievements.set("just wrong", Game.Achievements['Just wrong'].won);
		this.logic_achievements.set("fading luck", Game.Achievements['Fading luck'].won);

		/* harder achievements */
		this.logic_achievements.set("true neverclick", Game.Achievements['True Neverclick'].won);

		this.logic_achievements.set("polymath", Game.Achievements['Polymath'].won);
		this.logic_achievements.set("ren baker", Game.Achievements['Renaissance baker'].won);
		this.logic_achievements.set("mathematician", Game.Achievements['Mathematician'].won);
		this.logic_achievements.set("base 10", Game.Achievements['Base 10'].won )

		this.logic_achievements.set("grandmapocalypse", Game.Achievements['Grandmapocalypse'].won);
		this.logic_achievements.set("wrath cookie", Game.Achievements['Wrath cookie'].won);
		this.logic_achievements.set("debt evasion", Game.Achievements['Debt evasion'].won);

	},
	auxiliary_init: function(){
		this.ascending = false;
		/* initialize the logic_achievements map */
		this.update_achievement_status();

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

		/* Freeze the array so it is immutable */
		Object.freeze(this.buildings_arr); 

		/* NUMBEr OF HEAVENLY CHIPS PER ASCENSION */
		this.ascension_milestones[0] = 365;									
		this.ascension_milestones[1] = 2550 - this.ascension_milestones[0]; 
		this.ascension_milestones[2] = 72936 - this.ascension_milestones[1];
		this.ascension_milestones[3] = 192935 - this.ascension_milestones[2];
		this.ascension_milestones[4] = 1029755 - this.ascension_milestones[3];
		this.ascension_milestones[5] = 3520889 - this.ascension_milestones[4];
		this.ascension_milestones[6] = 36420889 - this.ascension_milestones[5];
		this.ascension_milestones[7] = 152909774 - this.ascension_milestones[6];
		this.ascension_milestones[8] = 1809910651 - this.ascension_milestones[7];
		this.ascension_milestones[9] = 7473437347 - this.ascension_milestones[8];
		this.ascension_milestones[10] = 42584548438 - this.ascension_milestones[9];

		Object.freeze(this.ascension_milestones);


		/* 						HEAVENLY UPGRADES 					*/
		/* angel & demon */
		this.heavenly_upgrades.set('twin gates', 281);
		this.heavenly_upgrades.set('angels', 274);
		this.heavenly_upgrades.set('archangels', 275);
		this.heavenly_upgrades.set('virtues', 276);
		this.heavenly_upgrades.set('dominions', 277);
		this.heavenly_upgrades.set('cherubim', 278);
		this.heavenly_upgrades.set('kitten angels', 291);
		this.heavenly_upgrades.set('kitten wages', 646);
		this.heavenly_upgrades.set('cat ladies', 717);
		this.heavenly_upgrades.set('lactose intolerance', 718);
		this.heavenly_upgrades.set('seraphim', 279);
		this.heavenly_upgrades.set('god', 280);
		this.heavenly_upgrades.set('belphegor', 353);
		this.heavenly_upgrades.set('mammon', 354);
		this.heavenly_upgrades.set('abaddon', 355);
		this.heavenly_upgrades.set('satan', 356);
		this.heavenly_upgrades.set('asmodeus', 357);
		this.heavenly_upgrades.set('beelzebub', 358);
		this.heavenly_upgrades.set('lucifer', 359);
		this.heavenly_upgrades.set('synergies 1', 393);
		this.heavenly_upgrades.set('synergies 2', 394);
		this.heavenly_upgrades.set('chimera', 325);

		/* persistent */
		this.heavenly_upgrades.set('persistent memory', 141);
		this.heavenly_upgrades.set('perm upgrade 1', 264);
		this.heavenly_upgrades.set('perm upgrade 2', 265);
		this.heavenly_upgrades.set('perm upgrade 3', 266);
		this.heavenly_upgrades.set('perm upgrade 4', 267);
		this.heavenly_upgrades.set('perm upgrade 5', 268);
		this.heavenly_upgrades.set('checklist', 496);
		this.heavenly_upgrades.set('accounting', 561);
		this.heavenly_upgrades.set('printer', 505); /* artic monkeys */

		/* unshackled flavor */
		this.heavenly_upgrades.set('flavor', 787);
		this.heavenly_upgrades.set('berrylium', 788);
		this.heavenly_upgrades.set('blueberrylium', 789);
		this.heavenly_upgrades.set('chalcedhoney', 790);
		this.heavenly_upgrades.set('buttergold', 791);
		this.heavenly_upgrades.set('sugarmuck', 792);
		this.heavenly_upgrades.set('jetmint', 793);
		this.heavenly_upgrades.set('cherrysilver', 794);
		this.heavenly_upgrades.set('hazelrald', 795);
		this.heavenly_upgrades.set('mooncandy', 796);
		this.heavenly_upgrades.set('astrofudge', 797);
		this.heavenly_upgrades.set('alabascream', 798);
		this.heavenly_upgrades.set('iridyum', 799);
		this.heavenly_upgrades.set('glucosmium', 800);
		this.heavenly_upgrades.set('glimmeringue', 863);

		/* unshackled building */
		this.heavenly_upgrades.set('cursors', 768);
		this.heavenly_upgrades.set('grandmas', 769);
		this.heavenly_upgrades.set('farms', 770);
		this.heavenly_upgrades.set('mines', 771);
		this.heavenly_upgrades.set('factories', 772);
		this.heavenly_upgrades.set('banks', 773);
		this.heavenly_upgrades.set('temples', 774);
		this.heavenly_upgrades.set('wizards', 775);
		this.heavenly_upgrades.set('shipments', 776);
		this.heavenly_upgrades.set('alchemy', 777);
		this.heavenly_upgrades.set('portals', 778);
		this.heavenly_upgrades.set('time machiens', 779);
		this.heavenly_upgrades.set('antimatter', 780);
		this.heavenly_upgrades.set('prisms', 781);
		this.heavenly_upgrades.set('chancemakers', 782);
		this.heavenly_upgrades.set('factal engines', 783);
		this.heavenly_upgrades.set('javascript', 784);
		this.heavenly_upgrades.set('idleverses', 785);
		this.heavenly_upgrades.set('cortex bakers', 786);
		this.heavenly_upgrades.set('you', 864);

		/* golden cookie */
		this.heavenly_upgrades.set('heavenly luck', 282);
		this.heavenly_upgrades.set('lasting fortune', 283);
		this.heavenly_upgrades.set('golden switch', 327);
		this.heavenly_upgrades.set('lucky digit', 411);
		this.heavenly_upgrades.set('lucky number', 412);
		this.heavenly_upgrades.set('lucky payout', 413);
		this.heavenly_upgrades.set('residual luck', 365);
		this.heavenly_upgrades.set('decisive fate', 284);
		this.heavenly_upgrades.set('alert sound', 360);
		this.heavenly_upgrades.set('redoubled luck', 397);

		/* discount and luck */
		this.heavenly_upgrades.set('discount', 285);
		this.heavenly_upgrades.set('sales', 286);
		this.heavenly_upgrades.set('bakeries', 287);
		this.heavenly_upgrades.set('veil', 562);
		this.heavenly_upgrades.set('beginners luck', 591);
		this.heavenly_upgrades.set('membrane', 592);
		this.heavenly_upgrades.set('touch', 801);
		this.heavenly_upgrades.set('murmur', 802);
		this.heavenly_upgrades.set('edge', 803);
		this.heavenly_upgrades.set('fortune cookies', 643);

		/* season */
		this.heavenly_upgrades.set('season switcher', 181);
		this.heavenly_upgrades.set('starspawn', 269);
		this.heavenly_upgrades.set('starsnow', 270);
		this.heavenly_upgrades.set('starterror', 271);
		this.heavenly_upgrades.set('starlove', 272);
		this.heavenly_upgrades.set('startrade', 273);
		this.heavenly_upgrades.set('keepsakes', 537);

		/* cookie flavor */
		this.heavenly_upgrades.set('heavenly cookies', 395);
		this.heavenly_upgrades.set('tea biscuits', 253);
		this.heavenly_upgrades.set('macarons', 254);
		this.heavenly_upgrades.set('brand biscuits', 255);
		this.heavenly_upgrades.set('butter cookies', 326);
		this.heavenly_upgrades.set('wrinkly cookies', 396);
		this.heavenly_upgrades.set('crystal cookies', 539);
		this.heavenly_upgrades.set('maybe cookies', 540);
		this.heavenly_upgrades.set('not cookies', 541);
		this.heavenly_upgrades.set('pastries', 542);

		/* other production */
		this.heavenly_upgrades.set('starter kit', 288);
		this.heavenly_upgrades.set('starter kitchen', 289);
		this.heavenly_upgrades.set('bait', 292);
		this.heavenly_upgrades.set('corruption', 293);
		this.heavenly_upgrades.set('elder spice', 364);
		this.heavenly_upgrades.set('wrinkler eye', 495);
		this.heavenly_upgrades.set('halo gloves', 290);
		this.heavenly_upgrades.set('aura gloves', 719);
		this.heavenly_upgrades.set('luminous gloves', 720);
		this.heavenly_upgrades.set('five-finger discount', 368);

		/* sugar lump */
		this.heavenly_upgrades.set('caelestis', 408);
		this.heavenly_upgrades.set('sugar baking', 449);
		this.heavenly_upgrades.set('daemonicus', 409);
		this.heavenly_upgrades.set('sugar craving', 450);
		this.heavenly_upgrades.set('aging process', 451);
		this.heavenly_upgrades.set('inutilis', 410);

		/* other */
		this.heavenly_upgrades.set('legacy', 363);
		this.heavenly_upgrades.set('htbyd', 323);
		this.heavenly_upgrades.set('classic dairy', 328);
		this.heavenly_upgrades.set('basic wallpaper', 362);
		this.heavenly_upgrades.set('heralds', 520);
		this.heavenly_upgrades.set('wrapping paper', 819);
		this.heavenly_upgrades.set('fanciful dairy', 329);
		this.heavenly_upgrades.set('distinguished wallpaper', 804);
		this.heavenly_upgrades.set('sound test', 805);
		this.heavenly_upgrades.set('pet', 647);

		Object.freeze(this.heavenly_upgrades); 

	
	}
});