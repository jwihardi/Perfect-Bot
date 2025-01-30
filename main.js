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
			for(let i = 0; i < heavenly_upgrades_to_buy.length; i ++){
				Game.Upgrades[heavenly_upgrades_to_buy[i]].buy();
			}
		}

		const ascension_functions = [
			() => {
				heavenly_upgrades_to_buy = ['Legacy', 'Heavenly cookies', 'How to bake your dragon', 
				'Heavenly luck', 'Permanent upgrade slot I', 'Heralds', 
				'Box of brand biscuits', 'Tin of british tea biscuits', 'Box of macarons'];
				console.log("ascension 1");

			},
			() => {
				heavenly_upgrades_to_buy = ['Season switcher', 'Golden switch', 'Tin of butter cookies', 'Starter kit'];
				console.log("ascension 2");

			},
			() => {
				heavenly_upgrades_to_buy = ['Persistent memory', 'Halo gloves', 'Lasting fortune', 'Decisive fate', 
				'Lucky digit', 'Starter kitchen'];
				console.log("ascension 3");
				
			},
			() => {
				heavenly_upgrades_to_buy = ['Residual luck', 'Permanent upgrade slot II'];
				console.log("ascension 4");
			},
			() => {
				heavenly_upgrades_to_buy = ['Divine sales', 'Divine discount','Divine bakeries', 
					'Twin Gates of Transcendence', 'Angels', 'Archangels', 'Virtues', 'Dominions', 'Kitten angels', 
					'Belphegor', 'Mammon', 'Abaddon', 'Satan', 'Synergies Vol. I'];
				console.log("ascension 5");
			},
			() => {
				heavenly_upgrades_to_buy = ['Asmodeus', 'Cherubim', 'Beelzebub', 'Seraphim', 'Synergies Vol. II'];
				console.log("ascension 6");
			},
			() => {
				heavenly_upgrades_to_buy = ['Inspired checklist', 'Genius accounting', 'Label printer', 
					'Unshackled flavor', 'Unshackled cursors'];
				console.log("ascension 7");
			},
			() => {
				heavenly_upgrades_to_buy = ['Starlove', 'Starsnow', 'Starspawn', 'Startrade', 'Starterror', 
					'Unholy bait', 'Sacrilegious corruption', 'Elder spice', 'Wrinkly cookies',
					'Permanent upgrade slot III', 'Five-finger discount', 'Distilled essence of redoubled luck',
					'Heavenly luck', 'Classic dairy selection', 'Fanciful dairy selection', 'Basic wallpaper assortment',
					'Distinguished wallpaper assortment', 'Golden cookie alert sound', 'Lucifer', 'God', 'Chimera'];
				console.log("ascension 8");
			},
			() => {
				heavenly_upgrades_to_buy = ['Stevia Caelestis', 'Sugar baking', 'Sugar crystal cookies', 
					'Permanent upgrade slot IV'];
				console.log("ascension 9");
			},
			() => {
				heavenly_upgrades_to_buy = ['Unshackled grandmas', 'Unshackled berrylium', 'Sugar craving', 
					'Diabetica Daemonicus', 'Sugar aging process', 'Aura gloves', 'Lucky payout'];
				console.log("ascension 10");
			},
			() => {
				heavenly_upgrades_to_buy = ['Cat ladies', 'Kitten wages', 'Shimmering veil', 'Reinforced membrane', 'Keepsakes'];
				console.log("ascension 11");
			},
			() => {
				heavenly_upgrades_to_buy = ['Fortune cookies', 'Permanent upgrade slot V', 'Pet the dragon'];
				console.log("ascension 12");
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

	
	}
});