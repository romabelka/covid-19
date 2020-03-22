(this.webpackJsonpcovid19=this.webpackJsonpcovid19||[]).push([[0],{135:function(e,t,a){e.exports=a(250)},250:function(e,t,a){"use strict";a.r(t);var n,i=a(0),r=a.n(i),l=a(7),c=a.n(l),o=a(61);!function(e){e[e.healthy=0]="healthy",e[e.incubation=1]="incubation",e[e.mild=2]="mild",e[e.severe=3]="severe",e[e.death=4]="death",e[e.healed=5]="healed"}(n||(n={}));var s=a(253),h=a(252),u=function(e){var t=e.data,a=e.totals,n=e.quarantineTime,i=Math.floor(1e3/t.length),l=t.map((function(e){return{death:e.death/e.total,severe:e.severe/e.total,mild:e.mild/e.total,incubation:e.incubation/e.total,healed:e.healed/e.total,healthy:(e.total-e.death-e.severe-e.mild-e.incubation-e.healed)/e.total,beds:e.hospitalBeds/e.total}})).map((function(e,a){return r.a.createElement(r.a.Fragment,{key:a},r.a.createElement("rect",{width:i,height:500*e.death,x:a*i,y:0,fill:"black"}),r.a.createElement("rect",{width:i,height:500*e.healthy,x:a*i,y:500*e.death,fill:"grey"}),r.a.createElement("rect",{width:i,height:500*e.healed,x:a*i,y:500*(e.death+e.healthy),fill:"green"}),r.a.createElement("rect",{width:i,height:500*e.incubation,x:a*i,y:500*(e.death+e.healthy+e.healed),fill:"yellow"}),r.a.createElement("rect",{width:i,height:500*e.mild,x:a*i,y:500*(e.death+e.healthy+e.healed+e.incubation),fill:"orange"}),r.a.createElement("rect",{width:i,height:500*e.severe,x:a*i,y:500*(e.death+e.healthy+e.healed+e.incubation+e.mild),fill:"red"}),r.a.createElement("rect",{width:i,height:2,x:a*i,y:500-500*e.beds,fill:"blue"}),r.a.createElement("rect",{width:1,height:500,x:1e3*n/t.length,y:0,fill:"black"}))})),c=a.general,o=a.byAge;return r.a.createElement("div",null,r.a.createElement("svg",{width:1e3,height:500},l),function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("h3",{style:{color:"black"}},"Dead: ",e.dead,",",(100*e.dead/e.infected).toFixed(1),"% Dead/All Cases,",(100*e.dead/(e.healed+e.dead)).toFixed(1),"% Dead/Closed Cases, R0: ",e.R0.toFixed(2)),r.a.createElement("h3",{style:{color:"green"}},"Healed: ",e.healed),r.a.createElement("h3",{style:{color:"grey"}},"Not Infected: ",e.total-e.infected,"(",(100*(1-e.infected/e.total)).toFixed(1),"%)"),r.a.createElement("h3",{style:{color:"orange"}},"Mild symptoms: ",e.onlyMildSymptoms,"(",(100*e.onlyMildSymptoms/e.infected).toFixed(1),"%)"),r.a.createElement("h3",{style:{color:"red"}},"Severe symptoms: ",e.hadSevereSymptoms,"(",(100*e.hadSevereSymptoms/e.infected).toFixed(1),"%); Not hospitalized: ",e.severeNotHospitalized,", (",(100*e.severeNotHospitalized/e.hadSevereSymptoms).toFixed(1),"%);"),r.a.createElement("h3",{style:{color:"yellow"}},"Incubation"),r.a.createElement(h.a,null),r.a.createElement("h3",null,"Total population: ",e.total),r.a.createElement("h3",null,"Total cases: ",e.infected))}(c),function(e){var t=e.map((function(e,t){return{key:t,total:e.total,infected:"".concat(e.infected," (").concat(Math.round(100*e.infected/e.total),"%)"),dead:"".concat(e.dead," (").concat(Math.round(100*e.dead/e.total),"%)"),age:"".concat(10*t,"-").concat(10*t+9),deathRateAll:"".concat((100*e.dead/e.infected).toFixed(1),"%"),deathRateClosed:"".concat((100*e.dead/(e.dead+e.healed)).toFixed(1),"%"),mildOnly:"".concat((100*e.onlyMildSymptoms/e.infected).toFixed(1),"%")}}));return r.a.createElement(s.a,{dataSource:t,columns:[{key:"age",title:"Age Group",dataIndex:"age"},{key:"infected",title:"Infected",dataIndex:"infected"},{key:"dead",title:"Dead",dataIndex:"dead"},{key:"deathRateAll",title:"Mortality, all cases",dataIndex:"deathRateAll"},{key:"deathRateClosed",title:"Mortality, closed cases",dataIndex:"deathRateClosed"},{key:"mildOnly",title:"Mild cases",dataIndex:"mildOnly"}]})}(o))};var d=a(35),f=a(51),m=a(254),g=function(e){var t=e.population,a=e.handlePopulationChange,n=Array(10).fill(0).map((function(e,n){return r.a.createElement("div",{key:n},r.a.createElement("h4",null,"age group: ",10*n,"-",10*n+9),r.a.createElement(m.a,{defaultValue:t[n],min:0,max:1e4,marks:{0:0,1e4:1e4},onAfterChange:function(e){return a(n,e)}}))}));return r.a.createElement("div",null,r.a.createElement("h3",null,"Population:"),n)},v=function(e){var t=e.hospitalBeds,a=e.handleHospitalsChange;return r.a.createElement("div",null,r.a.createElement("h3",null,"Hospital beds:"),r.a.createElement(m.a,{defaultValue:t,min:0,max:1e3,marks:{0:0,1e3:1e3},onAfterChange:function(e){return a(e)}}))},p=function(e){var t=e.days,a=e.handleDaysChange;return r.a.createElement("div",null,r.a.createElement("h3",null,"Simulation days:"),r.a.createElement(m.a,{defaultValue:t,min:0,max:1e3,marks:{0:0,1e3:1e3},onAfterChange:function(e){return a(e)}}))},y=a(75),S=function(e){var t=e.update;return r.a.createElement(y.a,{onClick:t,type:"primary"},"Run Simulation")},E=function(e){var t=e.contacts,a=e.handleContactsChange,n=function(e){a(Object(d.a)({},t,{},e))};return r.a.createElement("div",null,r.a.createElement("h2",null,"Quarantine:"),r.a.createElement("h4",null,"Quarantine Days:"),r.a.createElement(m.a,{defaultValue:t.quarantineTime,min:0,max:1e3,marks:{0:0,1e3:1e3},onAfterChange:function(e){return n({quarantineTime:e})}}),r.a.createElement("h4",null,"Quarantine age:"),r.a.createElement(m.a,{defaultValue:t.quarantineAge,min:0,max:100,marks:{0:0,100:100},onAfterChange:function(e){return n({quarantineAge:e})}}),r.a.createElement("h4",null,"Average Contacts:"),r.a.createElement(m.a,{defaultValue:t.avContactsGeneral,min:0,max:40,marks:{0:0,40:40},onAfterChange:function(e){return n({avContactsGeneral:e})}}),r.a.createElement("h4",null,"Contacts Quarantined:"),r.a.createElement(m.a,{defaultValue:t.avContactsQuarantine,min:0,max:40,marks:{0:0,40:40},onAfterChange:function(e){return n({avContactsQuarantine:e})}}))},C=function(e){var t=e.travellers,a=e.handleTravellersChange;return r.a.createElement("div",null,r.a.createElement("h3",null,"Infected Travellers per day:"),r.a.createElement("p",null,"* after quarantine ends"),r.a.createElement(m.a,{defaultValue:t,min:0,max:10,marks:{0:0,10:10},onAfterChange:function(e){return a(e)}}))},b=function(e){var t=e.simulationData,a=e.setSimulationData,n=e.update;return r.a.createElement("div",{style:{width:"100%",padding:"0 30px"}},r.a.createElement("div",{style:{display:"flex",justifyContent:"space-between"}},r.a.createElement("h2",null,"Controls"),r.a.createElement(S,{update:n})),r.a.createElement(v,{hospitalBeds:t.hospitalBeds,handleHospitalsChange:function(e){return a(Object(d.a)({},t,{hospitalBeds:e}))}}),r.a.createElement(h.a,null),r.a.createElement(C,{handleTravellersChange:function(e){return a(Object(d.a)({},t,{travellers:e}))},travellers:t.travellers}),r.a.createElement(h.a,null),r.a.createElement(p,{handleDaysChange:function(e){return a(Object(d.a)({},t,{days:e}))},days:t.days}),r.a.createElement(h.a,null),r.a.createElement(E,{handleContactsChange:function(e){return a(Object(d.a)({},t,{socialContacts:e}))},contacts:t.socialContacts}),r.a.createElement(h.a,null),r.a.createElement(g,{population:t.infectedPopulation,handlePopulationChange:function(e,n){var i=Object(f.a)(t.infectedPopulation);i[e]=n,a(Object(d.a)({},t,{infectedPopulation:i}))}}))},x=a(50),D=a(255),k=function e(t){var a=this;Object(x.a)(this,e),this.id=void 0,this.age=void 0,this.immune=!1,this.infected=!1,this.hospitalized=!1,this.severeNotHospitalized=!1,this.infectionDay=0,this.infectionSpread=0,this.currentStageDay=0,this.infectionsStage=n.healthy,this.nextStage=n.incubation,this.history=new Map,this.nextDay=function(){a.infected&&(a.infectionDay++,a.currentStageDay++)},this.setStage=function(e){a.history.set(a.infectionsStage,a.currentStageDay),a.currentStageDay=0,a.infectionsStage=e},this.heal=function(){a.setStage(n.healed),a.immune=!0,a.infected=!1,a.hospitalized=!1},this.infect=function(){a.immune||a.infected||(a.infected=!0,a.infectionsStage=n.incubation,a.nextStage=n.mild,a.infectionDay=0,a.currentStageDay=0)},this.id=D.a(),this.age=t.age,Object.assign(this,t),this.infected&&this.infectionsStage===n.healthy&&(this.infectionsStage=n.incubation),this.infectionsStage===n.incubation&&(this.nextStage=n.mild)},w=a(132);function O(e,t){var a=1.05*e;return t<a?Math.exp(t-a):1}function j(e){return Math.random()<e}function A(e,t){for(var a=new Set;a.size<t;)a.add(Math.floor(Math.random()*e.length));return Object(f.a)(a).map((function(t){return e[t]}))}var T=function e(){var t=this,a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:M;Object(x.a)(this,e),this.characteristics=void 0,this.transmissionChance=function(){return t.characteristics.transmissionChance},this.severeStateChance=function(e){return e.infected&&e.infectionsStage===n.mild&&e.nextStage===n.severe?O(t.characteristics.averageMildToSevereDays,e.currentStageDay):0},this.deathChance=function(e){return e.infected&&e.infectionsStage===n.severe&&e.nextStage===n.death?O(t.characteristics.averageSevereToDeathDays,e.currentStageDay):0},this.recoverChance=function(e){return e.infected?e.infectionsStage===n.incubation?0:e.infectionsStage===n.mild?e.nextStage===n.healed?O(t.characteristics.averageMildToHealDays,e.currentStageDay):0:e.infectionsStage===n.severe?e.nextStage===n.healed?O(t.characteristics.averageSevereToHealDays,e.currentStageDay):0:1:1},this.symptomsStartChance=function(e){return e.infected&&e.infectionsStage===n.incubation?O(t.characteristics.averageIncubationDays,e.infectionDay):0},this.getNextStage=function(e){return e.infectionsStage===n.incubation?n.mild:e.infectionsStage===n.mild?j(t.characteristics.ageSevereChance[Math.floor(e.age/10)])?n.severe:n.healed:e.infectionsStage===n.severe?j((e.hospitalized?t.characteristics.ageDeathChance.hospitalized:t.characteristics.ageDeathChance.home)[Math.floor(e.age/10)])?n.death:n.healed:n.death},this.characteristics=a},M={transmissionChance:.005,averageIncubationDays:10,averageMildToHealDays:14,averageMildToSevereDays:7,averageSevereToHealDays:21,averageSevereToDeathDays:5,ageSevereChance:[.01,.03,.03,.03,.06,.14,.32,.5,.65,.7],ageDeathChance:{hospitalized:[.1,.15,.15,.15,.2,.25,.33,.45,.65,.7],home:[.1,.25,.25,.25,.35,.4,.5,.75,.9,.95]}},I={avContactsGeneral:20,avContactsQuarantine:1,quarantineTime:60,quarantineAge:0},z=function(){function e(){var t=this,a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new T,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,l=arguments.length>3&&void 0!==arguments[3]?arguments[3]:I,c=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0;Object(x.a)(this,e),this.hospitalBeds=0,this.population=void 0,this.virus=void 0,this.day=0,this.socialContacts=I,this.travellersPerDay=void 0,this.nextDay=function(){t.day++,t.incomingTravellers(),t.progressInfection(),t.progressSpread()},this.incomingTravellers=function(){var e;if(!(t.day<t.socialContacts.quarantineTime)){var a=Array(t.travellersPerDay).fill(35).map((function(e){return new k({age:e,infected:!0})}));(e=t.population).push.apply(e,Object(f.a)(a))}},this.run=function(e){for(var a=[],i=0;i<e;i++){t.nextDay();for(var r=0,l=0,c=0,o=0,s=0,h=0;h<t.population.length;h++)switch(t.population[h].infectionsStage){case n.incubation:r++;break;case n.mild:l++;break;case n.severe:c++;break;case n.death:o++;break;case n.healed:s++}a.push({total:t.population.length,incubation:r,mild:l,severe:c,death:o,healed:s,hospitalBeds:t.hospitalBeds})}return a},this.population=a,this.virus=i,this.hospitalBeds=r,this.socialContacts=l,this.travellersPerDay=c}return Object(w.a)(e,[{key:"progressInfection",value:function(){for(var e=this.population.filter((function(e){return e.hospitalized})).length,t=0;t<this.population.length;t++){var a=this.population[t];if(a.infected)switch(a.nextDay(),a.infectionsStage){case n.incubation:j(this.virus.symptomsStartChance(a))&&(a.setStage(n.mild),a.nextStage=this.virus.getNextStage(a));break;case n.mild:var i=this.virus.severeStateChance(a),r=this.virus.recoverChance(a);j(i)?(a.setStage(n.severe),e<=this.hospitalBeds?(a.hospitalized=!0,e++):a.severeNotHospitalized=!0,a.nextStage=this.virus.getNextStage(a)):j(r)&&a.heal();break;case n.severe:var l=this.virus.deathChance(a),c=this.virus.recoverChance(a);j(l)?(a.setStage(n.death),a.hospitalized=!1):j(c)&&a.heal()}}}},{key:"progressSpread",value:function(){for(var e=this,t=this.socialContacts,a=t.quarantineAge,i=t.avContactsGeneral,r=t.avContactsQuarantine,l=t.quarantineTime,c=this.population.filter((function(e){return e.infectionsStage!==n.death})),o=function(t){var n=e.population[t],o=e.day<l&&n.age>=a?r:i;A(c,o).forEach((function(t){t.infected&&j(e.virus.transmissionChance())&&(t.infectionSpread++,n.infect())}))},s=0;s<this.population.length;s++)o(s)}}]),e}(),q={position:"fixed",top:0,left:0,right:0,bottom:0,display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.5)",zIndex:999},H=function(e){return e.active?r.a.createElement("div",{style:q},r.a.createElement("h2",{style:{color:"#fff"}},"Running Simulation, it can take a while...")):null},B={infectedPopulation:[4333,3982,5086,6922,5977,5854,5182,2857,1e3,787],hospitalBeds:150,travellers:2,days:400,socialContacts:{avContactsQuarantine:1,avContactsGeneral:20,quarantineAge:50,quarantineTime:90}},F=function(){var e=Object(i.useState)(!0),t=Object(o.a)(e,2),a=t[0],n=t[1],l=Object(i.useState)(B),c=Object(o.a)(l,2),s=c[0],h=c[1],d=Object(i.useRef)(s),f=Object(i.useState)(null),m=Object(o.a)(f,2),g=m[0],v=m[1],p=Object(i.useState)(null),y=Object(o.a)(p,2),S=y[0],E=y[1];return Object(i.useLayoutEffect)((function(){a&&setTimeout((function(){var e=s.infectedPopulation.flatMap((function(e,t){return Array(e).fill(10*t+5).map((function(e){return new k({age:e})}))}));A(e,1e3).forEach((function(e){return e.infect()}));var t=new z(e,new T,s.hospitalBeds,s.socialContacts);window.simulation=t;var a=t.run(s.days),i={general:N(t.population),byAge:Array(10).fill(0).map((function(e,a){return N(t.population.filter((function(e){return e.age>=10*a&&e.age<10*(a+1)})))}))};n(!1),v(a),E(i),d.current=s}))}),[a]),r.a.createElement("div",null,r.a.createElement(H,{active:a}),r.a.createElement("h1",null,"Naive Infection Distribution"),r.a.createElement("div",{style:{display:"flex"}},g&&S&&r.a.createElement(u,{data:g,totals:S,quarantineTime:s.socialContacts.quarantineTime}),r.a.createElement(b,{update:function(){return n(!0)},simulationData:s,setSimulationData:h})))};function N(e){var t=e.filter((function(e){return e.infectionsStage!==n.healthy}));return{total:e.length,dead:e.filter((function(e){return e.infectionsStage===n.death})).length,infected:t.length,healed:e.filter((function(e){return e.infectionsStage===n.healed})).length,onlyMildSymptoms:t.filter((function(e){return e.history.has(n.incubation)&&!e.history.get(n.severe)})).length,hadSevereSymptoms:t.filter((function(e){return e.history.has(n.severe)||e.infectionsStage===n.severe})).length,severeNotHospitalized:t.filter((function(e){return e.severeNotHospitalized})).length,R0:t.reduce((function(e,t){return e+t.infectionSpread}),0)/t.length}}var R=function(){return r.a.createElement("div",null,r.a.createElement(F,null))};a(249);c.a.render(r.a.createElement(R,null),document.getElementById("root"))}},[[135,1,2]]]);
//# sourceMappingURL=main.8f2539b8.chunk.js.map