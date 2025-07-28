// Content script for Streaming Extended (Multi-platform)
(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.streamingExtendedInitialized) {
    return;
  }
  window.streamingExtendedInitialized = true;

  // Platform handlers
  const SUPPORTED_PLATFORMS = {
    'hotstar.com': 'HotstarHandler',
    'netflix.com': 'NetflixHandler', 
    'primevideo.com': 'PrimeVideoHandler',
    'disneyplus.com': 'DisneyPlusHandler',
    'hulu.com': 'HuluHandler',
    'max.com': 'MaxHandler'
  };

  // Base platform handler class
  class BasePlatformHandler {
    constructor() {
      this.platformName = 'Unknown';
      this.skipButtonSelectors = [];
      this.nextEpisodeSelectors = [];
      this.videoSelectors = ['video'];
    }

    findSkipButton() {
      return this.findElementBySelectors(this.skipButtonSelectors);
    }

    findNextEpisodeButton() {
      return this.findElementBySelectors(this.nextEpisodeSelectors);
    }

    findVideoElement() {
      return document.querySelector(this.videoSelectors.join(', '));
    }

    isWatchPage() {
      return this.findVideoElement() !== null;
    }

    extractShowName(title) {
      return title.split(' - ')[0].split(' | ')[0].trim();
    }

    findElementBySelectors(selectors) {
      for (const selector of selectors) {
        try {
          const element = document.querySelector(selector);
          if (element && this.isValidButton(element)) {
            return element;
          }
        } catch (e) {
          console.log(`Error with selector ${selector}:`, e);
        }
      }
      return null;
    }

    isValidButton(button) {
      if (!button) return false;
      
      const rect = button.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      const style = window.getComputedStyle(button);
      const isDisplayed = style.display !== 'none' && 
                         style.visibility !== 'hidden' && 
                         parseFloat(style.opacity) > 0;
      
      return isVisible && isDisplayed && !button.disabled;
    }
  }

  // Hotstar-specific handler
  class HotstarHandler extends BasePlatformHandler {
    constructor() {
      super();
      this.platformName = 'Hotstar';
      this.skipButtonSelectors = [
        'button[data-testid="skip-button"]',
        'button[class*="skip" i]',
        'button[aria-label*="skip" i]',
        '[role="button"][aria-label*="skip" i]',
        'button[class*="skip-intro"]',
        'button[class*="skipButton"]',
        'div[class*="skip"][role="button"]'
      ];
      this.nextEpisodeSelectors = [
        '[data-testid="auto-play-next"]',
        'button[class*="next" i]',
        'div[class*="next"][class*="episode"]',
        'div[class*="up-next"]',
        'button[aria-label*="next episode" i]'
      ];
    }

    isWatchPage() {
      const url = window.location.href.toLowerCase();
      return url.includes('/watch/') || 
             url.includes('/in/') || 
             url.includes('/us/') ||
             (url.includes('hotstar.com') && document.querySelector('video'));
    }

    extractShowName(title) {
      return title
        .replace(/\s*-\s*Disney\+\s*Hotstar/i, '')
        .replace(/\s*\|\s*Disney\+\s*Hotstar/i, '')
        .replace(/\s*Watch\s+/i, '')
        .replace(/\s*Season\s+\d+/i, '')
        .replace(/\s*Episode\s+\d+/i, '')
         }
})();, error);
 itialize:'ed to intended: FailStreaming Exerror('ole.
    cons (error) {
  } catchxtended();ingEw Stream
    netry {
   extensionitialize the}

  // In}
    }
  
      on);tton(buttlickBu.creturn this       r);
 erroton:', but hidden or clickingd: Errg Extendeaminor('Strele.errso con
       or) { (erratch cs;
      }turn succes  re
            y;
  pacittyle.o = originalSyle.opacityston.utt     b   sibility;
lStyle.vi = origina.visibilityn.style       butto;
 le.displayoriginalSty.display = .style   button   
     n);
     utton(buttoickB= this.clccess const su     
       = '1';
    .opacity button.style       ';
 ibleity = 'vissibil.style.vi  button  ';
    y = 'blockplatyle.disn.sto   but     
                };
.opacity
utton.style opacity: b
         .visibility,tton.style: bulityisibi        visplay,
  style.dton.splay: but   di
       tyle = {ginalSconst ori
           try {     
   alse;
 eturn fbutton) r (!  if  
  on) {on(buttnButtckHidde   cli
    }

 0;) === opacityyle.oat(st   parseFl       || 
    idden'== 'h =ibilitye.vis       styl| 
      === 'none' |e.display rn styl     retu;
 e(element)omputedStyldow.getCe = winstyl  const 
    t) {en(elemeniddntH isEleme}

   ;
    000)    }, 3      }
  tor);
  ndica(ildremoveChirentNode.par.   indicato       e) {
Nodparentndicator.      if (i {
  imeout(() =>setT);

      tordicainild(Chdy.appenddocument.bo      

      }
tyleSheet);(sChildpendapment.head.ocu   d`;
      }
               
    ase;  uppercm:forans-tr       text      px; 
 er-radius: 3        bord    4px; 
   2pxng:    paddi           0.2); 
255, (255, 255, round: rgbaackg           b   px; 
ze: 10    font-si         badge { 
 platform- .        px; }
    12e:t-siz { fonskip-message      .  6px; }
    ize: 1nt-son { foic     .skip-       }
  
          (-20px); }ateYm: translfortransopacity: 0; 00% {  1            
   eY(0); }atrm: translfo; trans 1ity:80% { opac               teY(0); }
  translatransform:opacity: 1;   0% {            ut {
   dFadeOdeeamingExtenrames str     @keyf
        `t =exinnerTSheet.style      tyles';
  tended-saming-exd = 'street.istyleShe        tyle");
nt("seateElemecrent.cumeSheet = dostylonst   c      ) {
d-styles')xtendereaming-e'stId(tBymenument.getElef (!doc
      i
      `;
: 8px;   gapter;
     n-items: cen   alig
     lay: flex;    disp2);
    55, 255, 0. rgba(255, 2px solidder: 1
        borrif;s-se sano,botI', Roegoe UFont, 'SacSystemstem, BlinkM-sypleily: -ap    font-fam
    forwards;eOut 3s FadtendedreamingEximation: st    an
    );, 255, 0.4rgba(0, 2120px x 2dow: 0 4p   box-sha
     ents: none;ter-ev poin    99;
   999-index: 9;
        z boldont-weight:  fx;
      e: 14p font-sizx;
       us: 8pborder-radix;
        ng: 8px 16pdi      padhite;
   w  color:
      9cc 100%);ff 0%, #009#00d4t(135deg, ar-gradienound: line  backgr
      .left}px; ${rect    left:   ;
 top - 40)}pxect. r.max(10,: ${Math     top;
   ion: fixed  posit    ext = `
  yle.cssTindicator.st   ();
   gClientRectBoundinn.getct = butto renstco      

;   `>
   e}</spanformNamlatandler.patformH.plge">${this-badlatforms="p clas     <span/span>
   ssage}<memessage">${ss="skip-   <span cla    /span>
 >⚡<icon""skip-n class=    <spaML = `
    nnerHTr.i indicato;
     r'kip-indicatoended-sreaming-extst 'Name =ator.class  indic    iv');
ent('dateElemocument.cre dndicator =t i    cons
  Skipped') {= 'Auto-on, message uttcator(b addSkipIndi}

   
    lse;turn fa      red');
thods faileclick meended: All xtStreaming Er('onsole.erro}

      ct);
      entElementton.parkButton(buhis.cliceturn t;
        rment')arent eleclick prying to nded: Treaming Extee.log('Stol    cons   
 ) {== 'BODY'Name !ent.tagarentElem&& button.plement on.parentEf (butt   i   }

 ;
     rn true        retu    })) {
ops));
  KeyboardPr, commoneyup'oardEvent('k(new KeybentchEvn.dispat     butto;
     oardProps))eybs', commonKypres'keboardEvent(vent(new Keyn.dispatchEtto  bu       ps));
 rdProeyboacommonK'keydown', Event(new Keyboardvent(on.dispatchE      butt};
    
           truecelable:  can    ,
      s: true     bubble   
     13,     which:3,
        1de:Co key     ,
       'Enter'   code:       er',
  key: 'Ent         ps = {
   eyboardPronKt commo       cons   us();
ton.foc         but() => {
 ter', nd enod('focus atryClickMeth  if ( }

    ue;
     urn trret             })) {
));
   ropsommonEventPclick', cuseEvent('w Mot(nedispatchEventton.bu     ));
     psventPronEseup', commoseEvent('mount(new MouatchEvesp  button.di;
        tProps)) commonEvensedown','mount(seEveent(new Moun.dispatchEv  butto
                  }; clientY
      tX,
       clien        true,
  ncelable:       ca      ,
les: true      bubb    indow,
   w   view:{
         rops = ventPonEmm  const co
        => {() se event', kMethod('mou if (tryClic     );

/ 2t heighp + (rect.tY = rect.tolien  const c
    2);t.width / eft + (rectX = rect.lst clienon c
     ct();gClientReoundinn.getB= buttorect nst    co
        }
true;
    return 
     .click())) { => buttonck', ()clict redihod('etryClickM    if (t   };

  }
   e;
        ls   return fae);
       or.messagd:`, err} failemethodName ${ed: ExtendStreamingog(` console.l
         ) {tch (error        } caturn true;
 re        ;
 succeeded`)dName} hometended: ${treaming Ext.log(`Ssole  con       ();
       fn.`);
    hodName}.. ${metded: Tryingg Exteng(`Streaminloole.cons              try {
 => {
     fn)thodName,ethod = (mekMyCliconst tr
      c     });
''
 .trim() : Contenttextnt ? button.Conte button.text      text:  ,
idbutton.       id: 
 sName,las.came: button      classNe,
  tagNamutton.tagName: b  
      `, {atformName}:Handler.pls.platform${thiutton on lick bpting to cded: Attem Extenmingeaole.log(`Str
      cons    }
;
  urn false     ret');
   ickided to clon prov butt Notended:ing Exreamrror('Stole.eons     c) {
   onbutt
      if (!utton) {ton(bBut

    click }
    }`);
     ick failed: clatformName}rmHandler.plthis.platfo${ode on isext epo n tError goingExtended: ming ea(`Stre.error consol         {
lse       } e
}`);formNameatler.platformHandthis.pln on ${toisode butd next epy clickefulled: Successtendtreaming Exlog(`S    console.);
      isode(.trackNextEpisth       {
   clicked)    if(  
 button);Button(s.click thilicked =     const c
 `);latformName}er.pHandlplatformhis.${tn xt episode oto neo empting to g Attg Extended:mineag(`Stronsole.lo     cte.now();
 ime = DaodeTstNextEpisis.lath {
      ton)ode(butpisperformNextE    


    } }     false;
    returnor);
     :', errrmSkipfoin perrror  Extended: Emingrror('Strea  console.e) {
      atch (error    } c }
         false;
   return       ame}`);
   r.platformNatformHandle{this.pl $} button onTypeclick ${skipo d t FaileExtended:treaming e.error(`S    consol        {
 } else      ue;
  turn tr  re     }`);
     Namermndler.platformHafo${this.platn button o} ypeked ${skipTfully clicessed: SuccExtendng eami`Strg(lo  console.       
             }
  ed`);pe} skippn, `${skipTyuttoor(bpIndicats.addSki    thi      {
       ions)catifiwNotngs.shottithis.sef ( i
                  pe);
     kipTykSkip(sactr     this.     ed) {
  (click if
       n);
uttotton(bickHiddenBu= this.clclicked onst        c     
 e}`);
   mNamtformHandler.plais.platforn ${thskipType} o to skip ${pting Attemded:g Extenog(`Streaminconsole.l 
              w();
 te.no DaTime =is.lastSkip   th   ry {
  ) {
      t skipTypeton,p(buterformSki }

    p    }
   
   false;    return
    error) {catch (      } 
ton);Button(butlid.isVadleranmHlatforturn this.p    re          }
 lse;
 n fa      returon)) {
    ains(buttument.contif (!doc    ry {
       tton) {
   (butlValidtiluttonS    isB}

lay);
    pDengs.ski this.setti
      },        }         }

 utton);ns.add(newBssedButtois.proce          th;
  , skipType)ttonrmSkip(newBurfohis.pe        t {
    ton))newButhas(ttons.edBuis.process& !thnewButton &     if (n();
     kipButtoualSthis.findActnewButton = nst         coon');
  or new buttg f searchind,valiger onButton no led: Extendming ('Streansole.log         cose {
  el       }e);
 kipTypton, sormSkip(buts.perfthi   ) {
       id(button)ttonStillVals.isBu(thi      if  {
  imeout(() =>     setT

 `);atformName}andler.pltformHlas.phims on ${tDelay}kipettings.shis.sskip in ${tpType} duling ${skiended: Scheming Extlog(`Streale.nsoco  
    }
     return;
        active');
 n ldow coo: Skipdedeaming Extenlog('Str    console.
    e < 5000) {ipTimlastSkw - this.f (no
      i);= Date.now(w  no   const
    {pType)on, skibuttcheduleSkip(

    s
    }  }elay);
    fectiveD efNextEpisode,xecuteut(eetTimeo        se {
 } els   ();
  eNextEpisode      execut0) {
   <= ctiveDelay    if (effe 
             };
   }
;
     0)00      }, 1   }
           
  tEpisode();teNex      execu{
        wButton)    if (ne
         );n(ButtopisodextE this.findNen =Buttost new con
           (() => {setTimeout   
        click');ound toode button fepist valid nexo tended: Ng Ex'Streaminonsole.log(          c else {
     }  ;
 , 10000)   }       k);
oClicbuttonTs.delete(extButtonrocessedN   this.p         () => {
ut(meo   setTi   
           
   onToClick);s.add(buttedNextButtonrocessthis.p         now();
 te.eTime = DasodtNextEpi  this.las      
  k);oClicttonTe(buxtEpisodrmNethis.perfo
          Name}`);rmndler.platfolatformHa.p${thison on ttode bug next episckin Clinded: Exteing(`Streamnsole.log     co{
     oClick) tonT if (but  
             ();
uttonpisodeBNextEs.find : thionton) ? buttalid(butllVsButtonStihis.ioClick = ttonTlet but        > {
 () = =EpisodeecuteNextexst   con
       
   );500, delayx(y = Math.maelaiveDconst effect
            e}`);
mNamorplatfdler.ormHans.platfs on ${thiay}m ${del inext episodeg nedulinSchtended: treaming Ex.log(`S     consoley;
 EpisodeDelas.nextngti.setay = thisst del      con   }

return;
   
        active');wn isode cooldoded: Next epaming Extene.log('Streol     cons000) {
   Time < 2tNextEpisodeis.lasnow - th (  if
    te.now();Dast now =      con      }

    return;

      settings');ed inis disablepisode o-next ded: Autng Exteng('Streamionsole.lo
        cde) {isoEpautoNext.settings.   if (!this) {
   (buttononButtxtEpisodeNeandle}

    h   }
    pe);
   on, skipTybuttcheduleSkip(      this.s{
  shouldSkip) 
      if (    }
Intro;
  s.autoSkipnghis.setti = tdSkip     shoulntro';
   kipType = 'i
        s')) {ipes('sko.includttonInf(bue if  } els
     pRecap;toSkiautings.p = this.set  shouldSkiap';
      e = 'rec     skipTyp  ly')) {
 usudes('previotonInfo.inclp') || butes('reca.includonInfose if (butt} elits;
      oSkipCred.autingshis.sett = tipSk should    ts';
   edi'cr = Type      skipd')) {
  ludes('en.incnInfobuttoredit') || ludes('cfo.incIntonbutse if (     } elpIntro;
 utoSki.a.settingsSkip = this  should
       'intro'; =pType ski{
       ng')) penincludes('otonInfo.i| butintro') |ncludes('tonInfo.iif (but    
  se;
 = falkipshouldSlet ;
      pe = 'intro'kipTyt s      le

();CaseLowerLabel}`.toriaxt} ${a`${buttonTe = Infot button
      consowerCase();| '').toLa-label') |arittribute('tton.getAbu (bel =iaLa    const ar();
  seoLowerCa || '').tontentn.textCxt = (buttotonTest buton     c) {
 buttontton(handleSkipBu
        }
   }
or);
   rrButton:', eEpisodeextkForNec chd: Error inndeeaming Exteerror('Str    console.   ) {
 h (error   } catc     }
);
      Buttonadd(nextButtons.ocessedNextis.prth      
    tButton);n(nextoodeButisNextEplethis.hand        {
  ) nextButton)s(.hatButtonsssedNexproce!this.Button && f (next
        i;n()eButtoisod.findNextEphisButton = tnextt        consy {
      tron() {
 eButtxtEpisodrNe   checkFo   }

  }
 r);
     s:', errockForButtonError in cheExtended: ('Streaming ole.error  cons      ror) {
(ertch 
      } ca      }
  ton);Butns.add(nextdNextButtoessehis.proc  t       tButton);
 tton(nexEpisodeBudleNext  this.han        n)) {
tonextButns.has(toButextprocessedNon && !this.f (nextButt   i     n();
isodeButtoindNextEps.fton = thionst nextBut     c   }

   );
     Button(skipns.addsedButtoces this.pro       n);
  toipButton(skandleSkipBut  this.h     )) {
   onpButts.has(skicessedButton !this.protton &&(skipBu
        if n();ButtolSkipctuathis.findAutton =  skipB const {
           try {
  Buttons()or checkF

   
    }
      }e;ue = falsuecessingQ this.isPro
       nally {fi}     
  :', error);ueon que actir processing: Errodedg Extentreaminror('Ssole.er       conor) {
  catch (err  }
      }      ;
00))olve, 1essetTimeout(rve => solw Promise(reit ne         awa;
 ait action()     aw    );
 Queue.shift(s.actionion = thict     const a 0) {
     th >e.lengQueuthis.action    while ( try {
     
     ue;
     ue = trrocessingQuehis.isP 
      t     turn;
re= 0) th ==lengionQueue.is.act| thingQueue |s.isProcess(thi{
      if ) ue(tionQueAcsync process  
    a }
  
   );
      }ute(   exec  se {
     } el
    y);ecute, delaetTimeout(ex  s      0) {
delay >       if (
        };
  );
  ionQueue(ssActs.proce thi      
 n);edActioappush(wreue.pis.actionQu
        th
               };     }
 
     r);ro', erion: queued actr inded: Erroeaming Extene.error('Str   consol    {
     tch (error)  } ca         action();
it    awa{
           try      > {
   ) = = async (rappedActionst w     con   
        
 return;sEnabled) (!this.i if
        = () => {ecute  const ex   = 0) {
  , delayonn(actitio   queueAc
    }
    
       }', error);
TimeUpdate:ndleVideoin ha: Error edtendtreaming Ex'Sle.error(so    con   
  {(error) } catch  }
     ;
       on())isodeButtNextEpckForhes.c) => thi((eueAction    this.qu      > 9)) {
 timeLeft  <= 10 &&eft (timeL||> 14) meLeft 5 && ti <= 1ftmeLe if ((ti 
          ime;
    currentT - video.urationdeo.deft = vinst timeL      co  
       ow;
 pdate = nastTimeUideoData.l v      ;
 eturn000) r 1 <tTimeUpdatelasvideoData.now - if (
              ;
  te.now()nst now = Da    coeo);
    ids.get(vElementdeos.viData = thi video    const          

  rn;Time) returentdeo.curn || !video.duratio (!vi   ifry {
     
      t(video) {imeUpdateandleVideoT    
    h
    }
n(), 3000);pisodeButtoorNextEthis.checkF=> (() Actionis.queue   th0);
    100ton(),tEpisodeBut.checkForNex => thiseAction(()s.queuhi));
      tsodeButton(orNextEpi this.checkFction(() =>.queueA    this  Name}`);
ler.platformlatformHandn ${this.pideo ended oxtended: Vg Ereaminlog(`Stole.cons     {
 d(video) ndeleVideoE   hand
    
  }
    }    5000);
 Events(), rVideoto> this.monit(() =Timeou  set
      error);ents:', oEvVidemonitorError in d: endeg Extreaminrror('Stonsole.e  cr) {
      catch (erro} );
      Events, 3000heckVideonterval(csetIrval = oCheckIntede this.vi);
       eoEvents(eckVid
        ch   };
          }
  );
   or err check:',o eventin videError ended:  ExtStreaming('e.errorol     cons
       ) { (errortch    } ca     });
                  }
           });
          e: 0
    astTimeUpdat  l              ate,
  nTimeUpd      o         nded,
        onE        eo, {
     s.set(videoElementid.v   this            
           te);
      UpdaimeonTpdate', r('timeuenedEventListdeo.ad      vi       d);
   Endeended', on('tenerLisddEvent    video.a                
   ;
         o)Update(videdeoTimeandleVi> this.hate = () =imeUpdnT   const o           deo);
  ded(vileVideoEnthis.hand> ) =ded = (onst onEn     c   

        Name}`);ler.platformHands.platform} on ${thi#${indexdeo element oring vided: Moniting Extenlog(`Streamsole.         con      {
  has(video))s.ideoElements.vhi if (!t           ) => {
  ex(video, indrEach(s.fo      video

           };
       Name}`)r.platformdle.platformHanthisnts on ${deo eleme.length} vind ${videosnded: Foueaming Exte.log(`Str    console
          ize) {eoElements.s !this.vid 0 &&h >ngtdeos.le       if(vi     
          eo');
  ctorAll('vidleerySedocument.quideos = st vcon  
               }

          return;      {
      Page())Watchler.isormHandhis.platf if (!t    {
        try           => {
vents = ()oEeckVidet ch        cons    }


    ull; = nheckIntervalis.videoC        thl);
  rvaInteoCheck(this.viderval clearInte
          {nterval)oCheckIdethis.vi if (
       try {     ents() {
 torVideoEvsync moni    a

');
    }inues('content.includent  textCo   t') ||
   ncludes('nexntent.iextCo   t   ip') ||
  es('sk.includContentxt te      ||
 ' ivame === 'd   tagNn' ||
      === 'buttotagNamen 
      returse();werCa.toLo '')||extContent  (node.tContent = text   const;
   owerCase()toL.tagName. node tagName =      const
se;return fal) node.tagNameif (!
       {e)nButtons(nodcouldContai  
  
    }
server;  return obver);
    push(obserrs.is.observe      th   

   
      });uee: trubtre,
        sst: true   childLi     ody, {
ument.bobserve(doc  observer.
    });

             }
  200);  },
               }     );
orButtons(checkF this.          led) {
   s.isEnab    if (thi {
        (() =>Timeoutetimeout = sthis.checkT
          ckTimeout);his.chearTimeout(tle      c
    odeButton();tEpis.checkForNex        thisk) {
  houldChec       if (s  });

          }
 });
            
              }rue;
      ldCheck = t  shou       {
       ons(node)) ContainButtlds.cou thipe === 1 &&.nodeTydeif (no          => {
     ode)ach((norEes.fdedNodation.adut  m         List') {
  'childpe ===ion.tymutat       if (  ion) => {
 utatch((mns.forEatatio
        muk = false;dCheclet shoul
        ;
bled) return!this.isEna (     if
   ations) => {(mutionObserver(= new Mutatr nst observe    co  erver() {
   createObs   }

 rue;
  trn    retu  ame}`);
mNer.platforndltformHa${this.platopped on onitoring stended: M Exeaming.log(`Str  console      }

 = null;
   his.video     ted);
    ndoundOnVideoEed', this.bener('endeEventListdeo.remov   this.viate);
     dOnTimeUpd, this.bounmeupdate'er('tiEventListendeo.removethis.vi{
        eo) this.vidf (      i  }


    l;nulkTimeout = .chec      this  kTimeout);
his.checarTimeout(t        cle) {
imeoutkTf (this.chec

      i }l;
     val = nulerhis.checkInt      tal);
  rvheckInte(this.cnterval clearI       nterval) {
kIhis.chec(t     if 
      }
;
 rver = nullse    this.ob    
();ctconneerver.dishis.obs
        trver) {this.obse     if (ring() {
 ito    stopMon   }

 true;
  return
     Buttons();ckForthis.ches();
      oEventtorVides.moni thi;

     , 1000)    }  );
orButtons(eckFch    this.=> {
    terval(()  = setInckInterval   this.cher();
   Observeates.cre= thi.observer     this

  ;rmName}...`)latfor.pHandleplatformn ${this.ng o monitoriting Starded:tenStreaming Exg(`ole.lo     cons;
 ing().stopMonitor  this   ng() {
 rtMonitori  stareness)
  awaorm th platfwigic but ng log existids (keepiny methounctionalit   // Core f   }

 
  0;?.skips ||hKey]montyStats[ics.monthlthis.statistturn );
      re(new Date()getMonthKeythis. monthKey = nst{
      coips() thSkontThisM    ge;
    }

?.skips || 0Key][weekeeklyStats.wtisticsthis.sta return 
     te());kKey(new Dathis.getWeeKey = eek   const w
   () {sWeekSkips
    getThi);
    }
unt })how, cont]) => ({ scou([show,   .map(
      t)limi .slice(0, )
        b - a]) =>,bt(([,a], [      .sorows)
  tchedSh.mostWaicsatisthis.stct.entries(t return Obje {
     5) = s(limitowpShtTo
    ge}

       };mName
   ler.platforandplatformH this.  platform:),
      onthSkips(.getThisMisth: hSkips thisMont),
       kSkips(WeeThisthis.getsWeekSkips:      thi   pShows(5),
Tothis.getows:  topShy,
       nsTodas.sessioictatist: this.sayionsTod     sess   ks,
eClicEpisodnextistics.his.staticks: tClpisodextE    ne
    lSkips,nuatatistics.mahis.sualSkips: tman  ips,
      cs.recapSkis.statistiips: thecapSk       rSkips,
 ics.creditist this.statSkips:  credit    ips,
  troSkcs.intatistiips: this.sintroSk      ,
  / 60)dSeconds s.timeSaveistichis.statround(th.utes: MattimeSavedMin    ds),
    eSavedSeconics.timtatistthis.smatTime(: this.forSaved      time
  otalSkips,s.t.statistickips: thistotalS
        turn {  re
    sSummary() {tatistic    getS    }

;
      }
{secs}s``$  return      else {
     }s}s`;
   sectes}m ${inurn `${m  retu    ) {
  nutes > 0f (mi   } else i}s`;
   }m ${secsminutes${`${hours}h n  retur       > 0) {
 ursho    if (
   60;
       %dss = seconsec     const 0) / 60);
 econds % 360r((s= Math.floos minute  const      3600);
or(seconds /ath.flohours = Mt     consds) {
  con(sematTime}

    for     1) / 7);
86400000) +rStart) / l((((d - yearn Math.cei      retu));
0, 1r(), eatUTCFullYgeDate.UTC(d. new Date(rStart = const yea;
     4 - dayNum)) + getUTCDate(ate(d.setUTCD;
      d.() || 7d.getUTCDay = st dayNum
      conetDate()));.g(), dateonthdate.getM(), getFullYeare.UTC(date.ate(Dat= new Dst d   con    r(date) {
umbe  getWeekN
      }
)}`;
tart(2, '0'tring().padSoSnth.tr}-${mo `${yeaturn
      re) + 1;te.getMonth(th = da  const mon  ar();
  YegetFullear = date. const y    {
  nthKey(date)   getMo
    }

 {week}`;`${year}-W$n tur  re
    ber(date);s.getWeekNum thi = weekonst     c);
 FullYear( date.gett year = cons {
     Key(date)   getWeek  }

 ;
  ed += 30imeSavthKey].tats[monmonthlySts.stic  this.stati   kips++;
 .s[monthKey]nthlyStatstics.mo.statis    this
  
      } 0 };meSaved:ips: 0, ti skonthKey] = {Stats[mtics.monthlys.statisthi
        y]) {nthKethlyStats[momoncs.statistiif (!this.        
0;
    aved += 3ekKey].timeSeklyStats[weistics.we.stathis++;
      tkipseekKey].sats[wlySttistics.weektais.s}
      th    d: 0 };
  Save time: 0,] = { skipsts[weekKeyStacs.weeklyatisti    this.st  ey]) {
  eekKtats[ws.weeklyStictiss.sta   if (!thi       
(now);
  .getMonthKeyKey = thisthononst mw);
      cWeekKey(nogetthis.weekKey =   const 
    e(); new Dat = now
      constodStats() {riPe
    track
    }
    }  , error);
 show name:' track Could not Extended:g('Streamingsole.locon       (error) {
 catch 
      }       };
  howName]++s[sowdSh.mostWatche.statistics this         
      }    e] = 0;
ows[showNamatchedShtWmoss.tatistic.s  this  
        me]) {wNadShows[shoWatchetics.moststatishis.   if (!t   ) {
    owName (sh     if 
      
    e);owName(titlextractShformHandler.his.plat t showName =st
        contitle; = document.st title
        con {    try() {
  rrentShowtrackCu
    ;
    }
Clicks}`)xtEpisodeistics.nes.stattal: ${thimName}. Totforler.platformHand{this.plalick on $ coded next episnded: Trackeg Exte`Streaminonsole.log( ccs();
     veStatistithis.sa;
      eriodStats()is.trackP    th);
  Show(Currentack     this.trClicks++;
 tEpisode.nextatistics     this.s
 pisode() {trackNextE}

    `);
    onds)}timeSavedSecstatistics.is.matTime(th ${this.forme saved: tialame}. TotmNdler.platforformHanhis.plat{t} skip on $skipTypeed ${d: Trackxtende`Streaming E.log(sole con     
     ();
 isticsatsaveSt
      this.ats();dStioackPerthis.tr     ();
 howrentSckCur   this.tra
      
     };
    ; breakkips++manualStatistics.: this.sl'nua    case 'ma
    reak;apSkips++; btistics.recthis.sta: p' case 'reca  ;
     s++; breakreditSkipatistics.c: this.stts'se 'credi        cabreak;
s++; .introSkiptics.statisntro': this  case 'i      pe) {
(skipTyitch 
      swed;
      edTimeSavimat += esteconds.timeSavedSsticss.stati
      thialSkips++;istics.totatthis.st{
      ed = 30) matedTimeSavstiype, eckSkip(skipT

    tra    }
tics });s.statishiStats: tendedmingExtet({ strea.local.some.storagechr      tics() {
  saveStatis }

  ;
   });
             })lve();
   reso     );
   Statistics(is.save th                 
    }
  y++;
      essionsTodatatistics.s    this.s        } else {
         ;
 e = todaystSessionDattistics.la    this.sta1;
        ionsToday = ics.sessstatists.         thi
   !== today) {SessionDate cs.laststiis.statith        if (g();
  in.toDateStr new Date()y =  const toda
               
     }        ;
dStats }amingExtendet.stre, ...resulatisticssts.thics = { ...tistithis.sta          
  s) {attendedSt.streamingExlt  if (resu
        t) => {'], (resulendedStatsxtstreamingEet(['al.gstorage.locchrome.{
        ve) => esolomise((rurn new Pr
      ret {Statistics() async load
   )ementationmpling i existds (keepinghoetstics m    // Stati;
    }

, 2500)0);
      } }, 30  }
              tion);
 (notificaeChildemovntNode.rtion.paretifica      noe) {
      parentNodation.ific   if (not        {
eout(() =>tTim     se;
   ease-in' 0.3s tcutSlideOut'shorn = atio.animleion.stytificat        no) => {
tTimeout((      se);

icationd(notify.appendChilnt.bod docume
       }

    Sheet);ild(styleappendChment.head.ocu    d;
         ` }
      ;
      acing: 0.5px  letter-sp       rcase; 
   sform: uppeext-tran          t4px; 
  -radius:    border   px; 
       6adding: 2px p
           ;  0.2)255,0, 212,  rgba(background:       ; 
      10pxfont-size:       
      { getform-bad        .pla: 500; }
  -weight: 14px; fontize { font-s-message   .shortcut        }
n: center; text-aligdth: 24px;px; min-wi20e:  { font-sizrtcut-iconsho        .  }
         0; }
 city: (0.8); opascale100%) X(slate tranransform:    to { t
        ; }acity: 11); op(0) scale(ranslateXorm: transf{ tfrom          t {
   lideOuortcutSmes sh    @keyfra
              } 1; }
  ity:; opace(1)0) scaleX(slatorm: trannsfto { tra            }
ty: 0; (0.8); opacile0%) sca(10ranslateX: torm{ transfrom         f    In {
tSlideortcumes sh     @keyfra     `
 t =rTexheet.inne     styleS
   ut-styles';-shortc= 'streamingleSheet.id    sty
     "style");eElement(t.creatocumen = deetstyleSh  const      )) {
 es'ylt-sthortcuming-sstreatById('etElemennt.g!documeif (    ;

        `);
0pxur(1 blilter:rop-f   backdt;
     0.3s ease-oulideIn rtcutSshoon: animati   ;
      12px    gap:
    ter;cenign-items: 
        alex; display: fl
       rif; sans-seRoboto,goe UI', ont, 'SeacSystemFinkMm, Blpple-systefamily: -a      font-
  #00d4ff;px solid   border: 2.3);
      255, 012, (0, 2ba32px rg0 8px dow: -sha  box   none;
   er-events: point
        99999;ndex: 9-i;
        zht: 600font-weig        ize: 16px;
     font-sx;
    12pdius:-ra  border     
 0px; 2adding: 16px   pte;
     or: whi
        col213e 100%);16a2e 0%, #135deg, #1a1dient(grar-ead: linackgroun b  x;
      20pt:       righ20px;
 top:        n: fixed;
 tio        posiext = `
e.cssTtion.stylcaotifi n  
         `;
      iv>
Name}</dlatformr.pndle.platformHage">${thisplatform-badclass="v       <diiv>
  essage}</dssage">${mt-me="shortcu<div class      </div>
  >${icon}on"rtcut-icclass="shodiv       <ML = `
  .innerHTication   notifation';
   ficnoti-shortcut-ndedng-exteeami 'str.className =ionotificat      n
ment('div');t.createElen = documenioificatonst not{
      csage, icon) ion(mescatutNotifiortc showSh      }

       }
);
❌'on Found', 'utt('No Skip BationicrtcutNotifis.showSho        th } else {
');
      'manualton,kip(skipButhis.performS;
        ting', '⏩')ppManually Skin('tNotificatiortcu.showSho    this   
 pButton) {     if (skitton();
 lSkipBuindActuathis.fButton =   const skip   ro() {
 SkipIntual

    man  }
    } '❌');
    und',utton Foode Bt Epison('No NexatiotificrtcutNhoshowS     this.se {
     } el   n);
 extButtopisode(nNextEs.perform
        thi', '⏭️');ode Next Epison('ForcingicatiutNotiftcowShorhis.sh       t
 tButton) {    if (nex
  tton();isodeBus.findNextEp = thi nextButton      constode() {
tEpisexeN
    forc    }
);
rtcut`ed'} via shod' : 'disabled ? 'enablesEnablion ${this.iExtensed: aming Extendg(`Strensole.lo co    
   }
          ing();
onitorpM this.sto   
     } else {
     oring();Monit this.start       nabled) {
sEthis.iif (  
       );
      ❌'
   '✅' : 'Enabled ?    this.is  bled',
   isa D'ExtensionEnabled' : xtension abled ? 'EsEn.i this
       n(tioicaifortcutNots.showShthi  
      d });
    nablethis.isEbled: xtensionEnaet({ eync.sage.shrome.stor
      cabled;!this.isEned = Enabl this.is      {
nsion()eExtegl

    tog
    }');in('+urn parts.jo     ret
       }
      ;
ey).push(k  parts {
      == 'meta')& key !t' &key !== 'al' && iftshkey !== 'rol' &&  !== 'cont (key;
      ifwerCase().toLoeyent.kst key = ev   con
        
 sh('meta');arts.puKey) pt.meta(even if t');
     push('aley) parts.ent.altKf (ev   it');
   h('shif parts.pusshiftKey)  if (event.
    l');.push('ctrrts patrlKey)ent.c if (ev= [];
     nst parts 
      cont) {KeyCombo(eve

    get    }');
nitializedcuts iboard shortKeynded: ing Extetreamole.log('S cons      
     ;

      })       }();
 pIntroki.manualS  this;
        fault()t.preventDe  even{
        kipIntro) ualScuts.manngs.shorthis.setti(key === tse if      } el  de();
 pisoeNextEorc      this.ft();
    ulntDefavevent.pre      e {
    sode)tEpits.forceNexcungs.short.setti== this = if (key      } else
  xtension();his.toggleE  t
        fault();Dentvent.preve  e {
        ion)ensoggleExttcuts.tgs.shorhis.settin== tf (key = 
        i  nt);
     ombo(evegetKeyC key = this.   const            
n;
 ed) retur.isEnablis  if (!th      vent) => {
own', (eeydListener('kt.addEvent documens() {
     dShortcutoarKeyb
    setup messagesconsoledated uph same but witin the hods rema metest of the// R    }

null;
    eturn      r     }
         }
  button;
   return {
       tButton) if (isNex

       (button);alidButtonisVdler.latformHan      this.p
    t')) &&play nexudes('.incl   ariaLabel      ||
   ) sode'es('next epi.includ   ariaLabel        xt') ||
 y ne'plaxt.includes(      te    
  ||ext ep') udes('nclin       text.) ||
     isode's('next ep.includetton = (textNextBu    const is  e();

  CaseroLow '').t-label') ||riaute('aAttribet = (button.gelst ariaLab      con
  se().trim();oLowerCa || '').tntentton.textCobut (st text = con       uttons) {
 of allBconst button  for (  
  ick]');"], [oncltonbut [role="'button,All(erySelectorment.qu= docuallButtons const 
      eButton() {extEpisodericNfindGen

       }      }
 null;
   return or);
     :', errtonButsodendNextEpiror in fi: ErExtended'Streaming ror(sole.ercon        (error) {
 } catch   );
   Button(cNextEpisodeindGeneriurn this.f     ret
         }
tton;
  rn buetu        r
  mName}`);orler.platfplatformHand{this.button on $xt episode ound ned: Fg Extendeming(`Strea console.lo         tton) {
    if (bu
    ();eButtonsodndNextEpimHandler.fifor.plat = thison buttonst        c    
);
    ormName}...`r.platfatformHandleon ${this.pltton sode buxt epi for ne Searchingd:deg Extening(`Streamsole.lo     con         }


  n null;       retur{
    (!video)    if  ment();
   dVideoElendler.finHaormhis.platfeo = tonst vid
        c           }
     ll;
   return nu
       chPage()) {r.isWattformHandle(!this.pla       if {
 
      try utton() {sodeBdNextEpifin }

    ;
   null  return    
 
      }
     });
   ement', e elngor checkiErrtended:  ExStreamingnsole.log('  co    
     {h (e)tc        } ca     }
;
      element     return      nt)) {
 n(elemelidButtodler.isVaplatformHan&& this.kipButton (isS if                );

)
    s+/g, '')(/\placease.redes(phrist.inclu   classL   
      ) ||\s+/g, '-')ce(/e.replaphrasudes(cllassList.in       c  e) ||
   es(phrasludabel.incriaL a      e) ||
     ludes(phras text.inc         >
  (phrase =ome.sskipPhrasesn =  isSkipButtoconst          
();
oLowerCase).tass') || ''te('clibuetAttrent.g(elemssList =   const cla       e();
 werCas|| '').toLoia-label') 'arAttribute(.getementeliaLabel = (onst ar         ctrim();
 ).ase(werCtoLo|| '').ent textContnt.eme text = (el const
             try {
    lements) {lement of e(const er fo    

  
      ];p now'ment', 'skitisever, 'skip adip ad'sk', 'kip   's
     ap','skip recs', 'skip creditpening', o', 'skip o'skip intr       = [
 skipPhrases       const lick]');
 [onc"],"button div[role=button"],="utton, [role'bSelectorAll(ueryument.qments = doc const ele {
     SkipButton()dGeneric

    fin();
    }icSkipButtonnerthis.findGe   return 
        }

 on;return butt;
        owrch = neaButtonSast   this.lon);
     ttt('skip', bunCache.sehis.butto   t
     ormName}`);andler.platformH{this.platfn $on o skip buttundded: Foxtenreaming Ele.log(`Stso   con{
     tton) if (bu
      
      on();ButtindSkipandler.fmHtfors.pla = thiton  const but    
    ...`);
  ame}tformNandler.plaplatformHthis.on ${ton  butipg for skhinrctended: Seag Exeamine.log(`Strconsol    
      
  }
      }
        d;acheurn c     ret)) {
     tton(cachedidBuisValHandler.s.platform& thied &f (cach
        it('skip');ache.gebuttonCthis.cached = onst  c) {
       outheTimeis.buttonCac thSearch <stButtonla - this.now
      if (    );
  w(ate.no = Dnst now    cotton() {
  ualSkipBundActods
    fie methorm-awarPlatf/  }

    /);
      }
         }
  e();      resolvts');
    ulefae, using dailablnot avtorage : Chrome sExtendedStreaming e.log('     consol     e {
   } els            });
();
   esolve        r   );
 s, resultis.settingign(thbject.ass O         {
  lt) =>   ], (resu
        ortcuts''sh           
 tions',otifica'showN          lay',
  odeDeextEpis   'n    ay',
       'skipDel        ode',
  toNextEpis    'au,
        kipRecap'    'autoS   its',
     pCredutoSki       'a,
     o'pIntrutoSki  'a      ([
    etc.gorage.synst     chrome.     ync) {
ge.shrome.storaage && chrome.stor(c        if ve) => {
mise((resol new Pro     return
 s() {loadSettingsync   a    }

  
rmName}`);latformHandler.ptfo${this.plaon alized itided: Inming Extenlog(`Strea  console.}

    ;
             })     }
 
                }    }
       ing();
    opMonitor.st        this
        } else {             g();
 rtMonitorinis.sta        th   
     led) {Enab(this.is  if          ue;
   y].newValnges[keled = chanabs.isE         thi{
     d') nEnable== 'extensiof (key =  i        alue;
  s[key].newVhangey] = cngs[ke this.setti        ges) {
    key in chan for (let       {
   hanges) =>(cistener(hanged.addLge.onCrome.stora
        chnged) {nChae.oage.stor&& chromome.storage      if (chr

   }g();
    orinartMonits.st        thi{
Enabled)  if (this.is;

     }
      });
         })icsSummary()tisttStas.getistics: thi{ staResponse( send      ) {
   s'istic== 'getStation =message.actse if (      } el }
        ');
   on disablednsitended: Exte Exeamingog('Strconsole.l          );
  g(rinonitoopM  this.st        
   else {
          }ed');nsion enablnded: Exte Exteeamingole.log('Str      cons
      ing();onitortartM     this.s  
     {ed) Enablishis.       if (tled;
   nabge.e messa =abledthis.isEn
          nEnabled') {'setExtensioction === message.aif (    
    onse) => {Respsender, sendsage, ener((mes.addListessagee.onMuntimme.r  chrolse;

    == faabled !.extensionEns.settingsthid = isEnable
      this.s();tingdSett this.loa      awai {
init()
    async    }

 ics();oadStatist  this.l  ;
  cuts()oardShorteybs.setupKthi
      his.init();    t  

      };
yStats: {}onthl     mts: {},
   klySta   wee: {},
     hedShows  mostWatc,
      ulle: nDationlastSess   y: 0,
     da  sessionsTo
      nds: 0,Secoved   timeSa,
     icks: 0ClnextEpisode,
         0ips:ualSk
        mankips: 0,    recapS0,
    itSkips:       cred: 0,
  introSkips        lSkips: 0,
    totacs = {
    is.statisti    th
  trackingStatistics 
      //  t();
     ew WeakSetons = nNextButsed this.proces);
     akSet(ew Wettons = ncessedBu   this.proe = 0;
   tEpisodeTimthis.lastNex     
 ipTime = 0; this.lastSk           
false;
singQueue = isProcesthis.
      = [];ctionQueue .a      this2000;
imeout = buttonCacheTs.thi
      nSearch = 0;lastButto this.
     );p( = new MaonCachethis.butt;
      nullterval = InvideoCheck this.);
     w Map(nets = .videoElemen
      this[];servers =  this.obue;
     led = trhis.isEnab

      t
      };        }i'
+shift+rlro: 'ctanualSkipInt m
         +shift+n',de: 'ctrlEpiso  forceNext     s',
   rl+shift+sion: 'ctoggleExten        t: {
   shortcutsse,
       ations: falwNotificho        selay: 0,
isodeDnextEp,
        1000elay:   skipD      ,
e: truetoNextEpisod       aup: true,
 autoSkipReca    
    dits: true,autoSkipCre        rue,
ntro: t  autoSkipI   : true,
   abledonEnxtensi
        e = {gstinthis.set       
  
   ormName}`);r.platfatformHandle ${this.pl -platformDetected tended:  Exg(`Streaming  console.lo;
    orm()tfr.detectPlamDetectoPlatfor = tformHandlerla  this.per
    dlriate hanreate approprm and c platfoDetect   //   
 ctor() {nstrud {
    cotendereamingExclass St  }

  
  }
    }   r();
 formHandlelatw BasePnereturn   :
           default();
     MaxHandlerurn new et r
         ndler':xHae 'Macas;
        luHandler()eturn new Hu          r
r':uHandle case 'Hul
       Handler(); DisneyPlus  return new   ':
     andleryPlusH 'Disnecase
        );ler(VideoHandn new Prime   retur:
       Handler'deomeVicase 'Pri       
 andler();new NetflixH   return r':
       dleflixHan   case 'Net  );
   er(otstarHandlrn new Hetu
          r':Handler'Hotstarcase        e) {
 ClassNamandlerh (h   switce) {
   dlerClassNamHandler(hantecrea  static 

  k
    }// Fallbacler(); Handrmfoew BasePlateturn n  r    
    
      }
   }s);
       (handlerClasteHandler.creaectorlatformDetreturn P       ) {
   es(platform)udname.incl    if (host {
    ))_PLATFORMSs(SUPPORTED.entriebjectClass] of Ondler, halatform [pr (const fo   
     
   ase();oLowerCame.ttntion.hosdow.locame = winhostna   const    ) {
m(latfortectPtatic de   setector {
 s PlatformD  clasctory
ler fahandn and ioorm detect // Platf}

 
  ;
    }trim()| ')[0].').split(' Max', ' | le.replace('urn titret      le) {
me(titactShowNa

    extr   }');
 ('videoSelectorument.querydoc           && 
   er/')des('/playname.inclupathion.ow.locatn wind      retur
ge() {tchPa    isWa }

  ];
   '
    e buttonodxt-epis    '.ne
    " i]',sode*="Next Epi-label'button[aria
        ctors = [tEpisodeSele.nex
      this    ];on'
  ro buttnt    '.skip-i" i]',
    "Skipl*=ria-labe  'button[a[
      Selectors = Buttonip.sk  this
    '; = 'MaxNameis.platform;
      ther()   sup) {
   nstructor(
    coHandler {sePlatformextends BaaxHandler ss Mler
  cla/ Max hand /
   }
    }
.trim();
(' - ')[0]'').split, - Hulu'e.replace(' turn titl {
      re(title)ctShowName    extra    }


);'video'r(erySelectoocument.qu    d       && 
   ')atch/cludes('/wame.inthntion.pa.locadowwinrn      retuPage() {
     isWatch}

;
    
      ]sode" i]'"Next Epia-label*=n[ari    'butto   n"]',
 uttoEpisodeBstid="Nextata-te  'button[d     = [
 ors SelectisodeextEp     this.n;
 
      ]button'ro int'.skip-
        Skip" i]',*="a-labelbutton[ari    'n"]',
    pIntroButtostid="Skita-tebutton[da  '= [
      tors ecnSelskipButto   this.ulu';
   e = 'HlatformNam   this.p);
   per(      su{
tor() ruc{
    constdler mHanePlatforextends Basndler ss HuluHa  cla handler
/ Hulu
  /  }
  }
rim();
  0].t | ')[ '').split('| Disney+',.replace(' tlen ti      reture(title) {
howNam extractS

   ');
    }tor('videoquerySelecent.cum          do') && 
   eo//vid('ludesathname.incn.pndow.locatio   return wi
   ) {chPage( isWat  }

         ];
  ton'
p-next but      '.u',
   i]"pisode Eext"Nl*=beia-la'button[ar       "]',
 tonext-butstid="up-ntebutton[data-     '= [
   electors deSxtEpisothis.ne   
   ;'
      ]intro button     '.skip-  i]',
 p" el*="Skion[aria-lab    'buttn"]',
    to-credits-butd="skipn[data-testi'butto    
    on"]',p-intro-buttskiestid="n[data-tbutto      's = [
  electoruttonShis.skipB';
      t = 'Disney+Nametform this.pla);
          super(tor() {
 nstrucr {
    coandlelatformHxtends BasePdler esHansneyPluclass Dier
  dl Disney+ han  }

  //);
    }
m(tri)[0]..split(' - '', '') Videoce(' - Prime.replatleurn ti     ret {
 itle)wName(tractSho   ext}

   eo');
  lector('vidSe.queryumentdoc             
 /')) &&('/playerincludes.pathname.dow.location     win     
    ail/') || /detcludes('ame.inathnw.location.prn (windo  retu   {
  sWatchPage()

    i
    }  ];'
    t"]tid*="nexdata-tes        '[" i]',
lass*="next[ctton   'bun',
     p butto    '.nextU i]',
    t Episode"l*="Nexlaberia-button[a[
        'lectors = eSeodpisis.nextE
      th]'
      ];*="skip"estidata-t  '[d
      ip" i]',"skass*=utton[cl   'b    ,
 n'toElement but    '.skip]',
    " i="Skiplabel*ia- 'button[ar
       rs = [nSelectouttokipB    this.seo';
  ime Vidme = 'PrrmNas.platfo     thi;
     super()r() {
  ructo
    const {ndlerlatformHaasePds Bandler extenrimeVideoH
  class Pereo handlVidme ri// P
  }

  );
    }0].trim(' - ')['').split(, etflix'' - Nlace(le.repn tit retur
      {tle)e(tiractShowNam ext
     }
video');
  ector('erySelument.qu         doc& 
    ') &h/('/watc.includeson.pathnameti.locan windowretur() {
      sWatchPage }

    i    ];
     i]'
pisode" *="Next Ea-labelon[ari  'butt
      tton',sode bu '.next-epi
       video"]',="watch-uiaa-tton[dat 'bu     ode"]',
  is-epia="nextn[data-u   'buttos = [
     orisodeSelecthis.nextEp    t
        ];p" i]'
l*="Skiabeutton[aria-l      'b,
  button'p-intro ki     '.s   n',
ttos bup-credit    '.ski"]',
    odext-epis-uia="neta[dautton       'b
 s"]',p-creditlayer-skia-uia="pon[dat       'butt
 ro"]',er-skip-int="playton[data-uia     'but
   lectors = [skipButtonSethis.     flix';
 me = 'NetplatformNa     this.);
 r(
      supetor() {onstruc   cr {
 atformHandletends BasePldler exxHantfli
  class Neandlerpecific hetflix-s

  // N }
     }.trim();
