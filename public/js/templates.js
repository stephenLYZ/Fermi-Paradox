this["R"] = this["R"] || {};
this["R"]["templates"] = this["R"]["templates"] || {};
this["R"]["templates"]["/Users/stephenliu/Desktop/FermiParadox/views/index"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "<div class=\"background\"></div><div class=\"stars\"></div><div class=\"lobby\"><div class=\"notifier\">Token not valid</div><div class=\"panel choice-screen onscreen\"><div class=\"entry-box\"><div class=\"btn create\"></div><div class=\"btn join\"></div></div></div><div class=\"panel join-screen\"><div class=\"box join-box\"><input class=\"token token-input\" type=\"text\" placeholder=\"\"> <span class=\"join-btn\"></span></div></div><div class=\"panel create-screen\"><div class=\"box create-box\"><div class=\"token\">asdfe</div><span>等待敌人中...</span></div></div></div><div class=\"lose hidden\"><div class=\"arrow\"><div class=\"content\">很遗憾， 你丧失了知道真相的资格。</div></div><div class=\"cancel\"></div></div><div class=\"win hidden\"><div class=\"mirror\"></div><div class=\"arrow win-content\"><div class=\"content\">你已经赢得了这个游戏 获得游戏过程自拍一张.</div></div><div class=\"cancel\"></div></div><canvas id=\"cx\" width=\"100%\" heigth=\"100%\"></canvas>";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "content", {"name":"partial","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = this.invokePartial(partials.mainlayout, '', 'mainlayout', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"usePartial":true,"useData":true});;
this["R"] = this["R"] || {};
this["R"]["templates"] = this["R"]["templates"] || {};
this["R"]["templates"]["/Users/stephenliu/Desktop/FermiParadox/views/mainlayout"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "<!doctype html><title>Fermi Paradox</title><meta charset=\"utf-8\"><meta name=\"description\" content=\"\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/css/main.css\">";
  },"3":function(depth0,helpers,partials,data) {
  return " ";
  },"5":function(depth0,helpers,partials,data) {
  return " <script type=\"text/javascript\" src=\"/js/reqwest.js\"></script><script type=\"text/javascript\" src=\"/js/handlebars.js\"></script><script type=\"text/javascript\" src=\"/js/es5-shim.js\"></script><script type=\"text/javascript\" src=\"/js/yapl.js\"></script><script type=\"text/javascript\" src=\"/js/handlebars.runtime.js\"></script><script type=\"text/javascript\" src=\"/js/regenerator.min.js\"></script><script type=\"text/javascript\" src=\"/js/socket.io.js\"></script><script type=\"text/javascript\" src=\"/js/handlebars.helpers.js\"></script><script type=\"text/javascript\" src=\"/js/templates.js\"></script><script type=\"text/javascript\" src=\"/js/core.js\"></script><script type=\"text/javascript\" src=\"/js/index.js\"></script><script type=\"text/javascript\" src=\"/js/extends.js\"></script>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.block || (depth0 && depth0.block) || helperMissing).call(depth0, "header", {"name":"block","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helpers.block || (depth0 && depth0.block) || helperMissing).call(depth0, "content", {"name":"block","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helpers.block || (depth0 && depth0.block) || helperMissing).call(depth0, "footer", {"name":"block","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});;