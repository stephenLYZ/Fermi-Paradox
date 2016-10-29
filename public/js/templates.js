this["R"] = this["R"] || {};
this["R"]["templates"] = this["R"]["templates"] || {};
this["R"]["templates"]["/Users/stephenliu/Desktop/fermi_paradox/views/index"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "<div class=\"lobby\"><div class=\"notifier\">Token not valid</div><div class=\"panel choice-screen onscreen\"><div class=\"box\"><div class=\"btn join\">Join</div><div class=\"btn create\">Create</div></div></div><div class=\"panel join-screen\"><div class=\"box\"><input class=\"token\" type=\"text\" placeholder=\"Token...\"><div class=\"btn\">Send</div></div></div><div class=\"panel create-screen\"><div class=\"box\"><div class=\"token\">asdfe</div><span>Wait for opponent...</span></div></div></div><div id=\"score\" class=\"score\">0 - 0</div><canvas id=\"cx\" width=\"100%\" heigth=\"100%\"></canvas>";
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
this["R"]["templates"]["/Users/stephenliu/Desktop/fermi_paradox/views/mainlayout"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "<!doctype html><title>Fermi Paradox</title><meta charset=\"utf-8\"><meta name=\"description\" content=\"\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/css/main.css\">";
  },"3":function(depth0,helpers,partials,data) {
  return " ";
  },"5":function(depth0,helpers,partials,data) {
  return "<script type=\"text/javascript\" src=\"/js/reqwest.js\"></script><script type=\"text/javascript\" src=\"/js/handlebars.js\"></script><script type=\"text/javascript\" src=\"/js/es5-shim.js\"></script><script type=\"text/javascript\" src=\"/js/yapl.js\"></script><script type=\"text/javascript\" src=\"/js/handlebars.runtime.js\"></script><script type=\"text/javascript\" src=\"/js/regenerator.min.js\"></script><script type=\"text/javascript\" src=\"/js/socket.io.js\"></script><script type=\"text/javascript\" src=\"/js/handlebars.helpers.js\"></script><script type=\"text/javascript\" src=\"/js/templates.js\"></script><script type=\"text/javascript\" src=\"/js/core.js\"></script><script type=\"text/javascript\" src=\"/js/index.js\"></script>";
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
this["R"] = this["R"] || {};
this["R"]["templates"] = this["R"]["templates"] || {};
this["R"]["templates"]["/Users/stephenliu/Desktop/fermi_paradox/views/vendorscripts"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing, buffer = " ";
  stack1 = ((helper = (helper = helpers.vendorScripts || (depth0 != null ? depth0.vendorScripts : depth0)) != null ? helper : helperMissing),(options={"name":"vendorScripts","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.vendorScripts) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<script type=\"text/javascript\" src=\""
    + escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "\"></script>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing;
  stack1 = ((helpers.block || (depth0 && depth0.block) || helperMissing).call(depth0, "scripts", {"name":"block","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});;