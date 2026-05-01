/* ZeroHunger TRL — loader. Loads engine then page logic. */
(function(){
  function load(src,cb){var s=document.createElement('script');s.src=src;s.onload=cb;document.head.appendChild(s);}
  var base='/src/js/';
  load(base+'trl_engine.js',function(){load(base+'trl_pages.js',null);});
})();
