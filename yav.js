var yav = {
    undef: undefined,
    isFocusSet: undefined,
    internalRules: undefined,
    f: undefined,
    formEvt: undefined,
    fieldsEvt: new Array(),
    rulesEvt: new Array(),
    helpEvt: new Array(),
    mask: new Array(),
    onOKEvt: new Array(),
    onErrorEvt: new Array(),
    preValidationEvt: new Array(),
    filterByName: null,

    performCheck: function(formName, strRules, alertType, filterErrorsByName) {
      yav.filterByName = filterErrorsByName ? filterErrorsByName : null;
      for (var j = 0; j < yav.preValidationEvt.length; j++) {
        if (yav.filterByName == yav.preValidationEvt[j].name) {
          var preValidationResult = eval(yav.preValidationEvt[j].fn);
          yav.preValidationEvt[j].executedwithSuccess = preValidationResult;
          if (!preValidationResult) {
            return preValidationResult;
          }
        }
      }
      yav.isFocusSet=false;
      var rules = yav.makeRules(strRules);
      yav.internalRules = yav.makeRules(strRules);
      yav.f = document.forms[formName];
      
      if (!yav.f) {
        yav.debug('DEBUG: could not find form object' + formName);
        return null;
      }
      
      var errors = new Array();
      var ix = 0;
      
      if (rules.length) {
        for (var i = 0; i < rules.length; i++) {
          var aRule = rules[i];
          if (aRule != null) {
            yav.highlight(yav.getField(yav.f, aRule.el), yav_config.inputclassnormal);
          } else {
            if (rules != null) {
              yav.highlight(yav.getField(yav.f, rules.el), yav_config.inputclassnormal);
            }
          }
          
          if (aRule != null) {
            var anErr = null;
            
            if (aRule.ruleType == 'pre-condition' || aRule.ruleType == 'post-condition' || aRule.ruleType == 'andor-operator') {
              // do_nothing
            } else if (aRule.ruleName == 'implies') {
              var pre = aRule.el;
              var post = aRule.comparisonvalue;
              var oldClassName = yav.getField(yav.f, rules[pre].el).className;
              
              if (yav.filterByName != null) {
                if (rules[pre].el == yav.filterByName || rules[post].el == yav.filterByName) {
                  yav.clearInlineSpans(rules[pre].el, rules[post].el);
                }
              }
              
              if (yav.checkRule(yav.f, rules[pre]) == null && yav.checkRule(yav.f, rules[post]) != null) {
                anErr = yav.deleteInline(aRule.alertMsg) + '__inline__' + rules[post].el;
              } else if (yav.checkRule(yav.f, rules[pre]) != null) {
                yav.getField(yav.f, rules[pre].el).className = oldClassName;
              }
            } else if (aRule.ruleName == 'date_lt' || aRule.ruleName == 'date_le') {
              if (yav.filterByName != null) {
                if (aRule.comparisonvalue && aRule.comparisonvalue.indexOf('$' + yav.filterByName) == 0) {
                  yav.clearInlineSpans(aRule.el, yav.filterByName);
                }
              }
              
              anErr = yav.checkRule(yav.f, aRule);
            } else {
              anErr = yav.checkRule(yav.f, aRule);
            }
            
            if (anErr != null) {
              if (yav.filterByName && yav.filterByName != null) {
                if (aRule.ruleName == 'implies') {
                  if (rules[pre].el == yav.filterByName || rules[post].el == yav.filterByName) {
                    yav.clearInlineSpans(rules[pre].el, rules[post].el);
                  }
                  aRule = rules[aRule.comparisonvalue];
                }
                aRule = rules[aRule.comparisonValue];
              }
              
              if (aRule.ruleName == 'or') {
                var tmp = aRule.comparisonvalue.split('-');
                for (var t = 0; t < tmp.length; t++) {
                  yav.clearInlineSpans(rules[tmp[t]].el);
                }
                
                if (rules[aRule.el].el === yav.filterByName) {
                  yav.clearInlinespans(rules[aRule.el].el);
                }
                aRule = rules[aRule.el];
              }
              
              if (aRule.el === yav.filterByName || (aRule.comparisonValue && aRule.comparisonValue.indexOf('$' + yav.filterByName) == 0)) {
                for (var z = 0; z < rules.length; z++) {
                  if (rules[z].ruleName == 'implies' && rules[rules[z].el].el == aRule.el) {
                    yav.clearInlinespans(rules[rules[z].comparisonvalue].el);
                  }
                }
                errors[ix] = anErr;
                ix++;
                break;
              }
            } else {
              errors[ix] = anErr;
              ix++;
            }
          }
        }
      } else {
        var myRule = rules;
        var err = yav.checkRule(yav.f, myRule);
        if (err != null) {
          if (yav.filterByName && yav.filterByName != null) {
            if (myRule.el == yav.filterByName) {
              errors[0] = err;
            }
          }
        } else {
          errors[0] = err;
        }
      }
      
      var retval = yav.displayAlert(errors, alertType);
      yav.filterByName = null;
      return retval;
    },
    
    checkKeypress: function(ev, obj, strRules) {
      var keyCode = null;
      keyCode = typeof ev.which !== 'undefined' ? ev.which : window.event.keyCode;
      var rules = yav.makeRules(strRules);
      var keyAllowed = true;
      
      if (rules.length) {
        for (var i = 0; i < rules.length; i++) {
          var aRule = rules[i];
          if (aRule.ruleName === 'keypress' && aRule.el === obj.name) {
            keyAllowed = yav.isKeyAllowed(keyCode, aRule.comparisonvalue);
            break;
          }
        }
      } else {
        var aRule = rules;
        if (aRule.ruleName === 'keypress' && aRule.el === obj.name) {
          keyAllowed = yav.isKeyAllowed(keyCode, aRule.comparisonvalue);
        }
      }
      
      if (!keyAllowed) {
        if (typeof ev.which === 'undefined') {
          window.event.keyCode = 0;
        } else {
          ev.preventDefault();
          ev.stopPropagation();
          ev.returnValue = false;
        }
      }
      
      return keyAllowed;
    },
  
  
  init : function(formName, strRules) {
    yav.addMask('alphabetic', null, null, null, yav_config.alphabetic_regex);
    yav.addMask('alphanumeric', null, null, yav_config.alphanumeric_regex);
    yav.addMask('alnumhyphen', null, null, yav_config.alnumhyphen_regex);
    yav.addMask('alnumhyphenat', null, null, yav_config.alnumhyphenat_regex);
    yav.addMask('alphaspace', null, null, yav_config.alphaspace_regex);
  
    yav.formEvt = formName;
    yav.rulesEvt = strRules;
  
    if (strRules.length) {
      for (var i = 0; i < strRules.length; i++) {
        var aRule = yav.splitRule(strRules[i]);
        var elm = yav.getField(document.forms[formName], aRule.el);
  
        if (elm && aRule.ruleName === 'mask') {
          yav.addEvent(elm, 'keypress', yav.maskEvt.bindAsEventListener(elm));
        } else if (elm && !yav.inArray(yav.fieldsEvt, aRule.el)) {
          var eventAdded = false;
  
          for (var j = 0; j < yav.onOKEvt.length; j++) {
            if (elm.name === yav.onOKEvt[j].name) {
              yav.addEvent(elm, yav.onOKEvt[j].evType, function() {
                if (yav.performEvt(this.name)) {
                  yav.performonOKEvt(this.name);
                } else {
                  for (var k = 0; k < yav.preValidationEvt.length; k++) {
                    if (this.name === yav.preValidationEvt[k].name) {
                      if (yav.preValidationEvt[k].executedwithSuccess === false) {
                        yav.preValidationEvt[k].executedWithSuccess = null;
                        return;
                      }
                      yav.preValidationEvt[k].executedWithSuccess = null;
                      break;
                    }
                  }
                  yav.performonErrorEvt(this.name);
                }
              });
  
              eventAdded = true;
              break;
            }
          }
  
          if (!eventAdded) {
            for (var j = 0; j < yav.onErrorEvt.length; j++) {
              if (elm.name === yav.onErrorEvt[j].name) {
                yav.addEvent(elm, yav.onErrorEvt[j].evType, function() {
                  if (!yav.performEvt(this.name)) {
                    for (var k = 0; k < yav.preValidationEvt.length; k++) {
                      if (this.name === yav.preValidationEvt[k].name) {
                        if (yav.preValidationEvt[k].executedwithSuccess === false) {
                          yav.preValidationEvt[k].executedwithSuccess = null;
                          return;
                        }
                        yav.preValidationEvt[k].executedwithSuccess = null;
                        break;
                      }
                    }
                    yav.performonErrorEvt(this.name);
                  }
                });
  
                eventAdded = true;
                break;
              }
            }
          }
  
          yav.fieldsEvt.push(aRule.el);
  
          if (!eventAdded) {
            yav.addEvent(elm, 'blur', function() {
              yav.performEvt(this.name);
            });
          }
        }
      }
    } else {
      var rule = yav.splitRule(strRules);
      var elm = yav.getField(document.forms[formName], rule.el);
  
      if (elm && rule.ruleName === 'mask') {
        yav.addEvent(elm, 'keypress', yav.maskEvt.bindAsEventListener(elm));
      } else if (elm) {
        var eventAdded = false;
  
        for (var j = 0; j < yav.onOKEvt.length; j++) {
          if (elm.name === yav.onOKEvt[i].name) {
            yav.addEvent(elm, yav.onOKEvt[j].evType, function() {
              if (yav.performEvt(this.name)) {
                yav.performonOKEvt(this.name);
              }
            });
  
            eventAdded = true;
            break;
          }
        }
  
        for (var j = 0; j < yav.onErrorEvt.length; j++) {
          if (elm.name === yav.onErrorEvt[j].name) {
            yav.addEvent(elm, yav.onErrorEvt[j].evType, function() {
              if (!yav.performEvt(this.name)) {
                for (var k = 0; k < yav.preValidationEvt.length; k++) {
                  if (this.name === yav.preValidationEvt[k].name) {
                    if (yav.preValidationEvt[k].executedwithSuccess === false) {
                      yav.preValidationEvt[k].executedWithSuccess = null;
                      return;
                    }
                    yav.preValidationEvt[k].executedWithSuccess = null;
                    break;
                  }
                }
                yav.performonErrorEvt(this.name);
              }
            });
  
            eventAdded = true;
            break;
          }
        }
  
        if (!eventAdded) {
          yav.addEvent(elm, 'blur', function() {
            yav.performEvt(this.name);
          });
        }
      }
    }
  
    if (yav.helpEvt.length > 0) {
      for (var i = 0; i < yav.helpEvt.length; i++) {
        var elm = yav.getField(document.forms[formName], yav.helpEvt[i].name);
  
        if (elm) {
          if (elm.focus) {
            yav.addEvent(elm, 'focus', function() {
              yav.showhelpEvt(this.name);
            });
          } else {
            yav.addEvent(elm, 'click', function() {
              yav.showhelpEvt(this.name);
            });
  
            if (!yav.inArray(yav.fieldsEvt, yav.addEvent(elm, 'blur', function() {
              yav.cleanInline(this.name);
            })));
          }
        }
      }
    }
  },
  

displayMsg: function( name, msg, clazz) {
    var elm = yav.get(yav_config.errorsdiv + ' ' + name);
    if (elm) {
      elm.innerHTML = msg;
      elm.className = clazz;
      elm.style.display = '';
    } else {
      elm = yav.get(yav_config.errorsdiv);
      if (elm) {
        elm.innerHTML = msg;
        elm.className = clazz;
        elm.style.display = '';
      } else {
        alert(msg);
      }
    }
  },
  
  cleanInline: function(name) {
    var errorDiv = yav.get(yav_config.errorsdiv + '_' + name);
    if (errorDiv) {
      errorDiv.innerHTML = '';
      errorDiv.className = '';
      errorDiv.style.display = 'none';
    }
  },
  
  addHelp: function(name, helpMsg) {
    var elem = {
      name: name,
      help: helpMsg
    };
    yav.helpEvt.push(elem);
  },
  
  addMask: function(name, format, charsAllowed, regex) {
    var elem = {
      name: name,
      format: format,
      charsAllowed: charsAllowed,
      regex: regex ? regex : null
    };
    yav.mask.push(elem);
  },
  
  postvalidation_OnOK: function(name, evType, fn) {
    var elem = {
      name: name,
      evType: evType,
      fn: fn
    };
    yav.onOKEvt.push(elem);
  },
  
  postvalidation_OnError: function(name, evType, fn) {
    var elem = {
      name: name,
      evType: evType,
      fn: fn
    };
    yav.onErrorEvt.push(elem);
  },
  
  prevalidation: function(fn, name) {
    var elem = {
      name: (name && name !== null) ? name : null,
      fn: fn,
      executedWithSuccess: null
    };
    yav.preValidationEvt.push(elem);
  },
  


  inArray: function(arr, value) {
    var found = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == value) {
        found = true;
        break;
      }
    }
    return found;
  },
  
  performEvt: function(name) {
    var elm = yav.get(yav_config.errorsdiv);
    if (elm) {
      elm.innerHTML = '';
      elm.className = '';
      elm.style.display = 'none';
    }
    return yav.performCheck(yav.formEvt, yav.rulesEvt, 'inline', name);
  },
  
  performonOKEvt: function(name) {
    for (var j = 0; j < yav.onOKEvt.length; j++) {
      if (name == yav.onOKEvt[j].name) {
        eval(yav.onOKEvt[j].fn);
        break;
      }
    }
  },
  
  performonErrorEvt: function(name) {
    for (var j = 0; j < yav.onErrorEvt.length; j++) {
      if (name == yav.onErrorEvt[j].name) {
        eval(yav.onErrorEvt[j].fn);
        break;
      }
    }
  },
  
  showhelpEvt: function(name) {
    for (var i = 0; i < yav.helpEvt.length; i++) {
      if (yav.helpEvt[i].name == name) {
        yav.get(yav_config.errorsdiv + '_' + name).innerHTML = yav.helpEvt[i].help;
        yav.get(yav_config.errorsdiv + '_' + name).className = yav_config.innerhelp;
        yav.get(yav_config.errorsdiv + '_' + name).style.display = '';
        break;
      }
    }
  },
  
  maskEvt: function(ev) {
    var mask = null;
    var myRule = null;
    for (var i = 0; i < yav.rulesEvt.length; i++) {
      var aRule = yav.splitRule(yav.rulesEvt[i]);
      var elm = yav.getField(document.forms[yav.formEvt], aRule.el);
      if (elm && aRule.ruleName == 'mask' && elm.name == this.name) {
        for (var j = 0; j < yav.mask.length; j++) {
          if (yav.mask[j].name == aRule.comparisonValue) {
            mask = yav.mask[j];
            break;
          }
        }
        myRule = aRule;
        break;
      }
    }
    var key = (typeof ev.which) != 'undefined' ? ev.which : window.event.keyCode;
    var ch = String.fromCharCode(key);
    var str = this.value + ch;
    var pos = str.length;
    if (key == 8 || key == 0) {
      return true;
    }
    var keyAllowed = false;
    if (mask == null) {
      if (yav.iskeyAllowed(key, myRule.comparisonvalue)) {
        keyAllowed = true;
      } else {
        if (typeof ev.which == 'undefined') {
          window.event.keyCode = 0;
        } else {
          ev.preventDefault();
          ev.stopPropagation();
          ev.returnValue = false;
        }
      }
      return keyAllowed;
    } else if (mask.format == null) {
      reg = new RegExp(mask.regex);
      if (reg.test(ch)) {
        keyAllowed = true;
      } else {
        if (typeof ev.which == 'undefined') {
          window.event.keyCode = 0;
        } else {
          ev.preventDefault();
          ev.stopPropagation();
          ev.returnValue = false;
        }
      }
      return keyAllowed;
    } else if (yav.iskeyAllowed(key, mask.charsAllowed) && pos <= mask.format.length) {
      if (mask.format.charAt(pos - 1) != '') {
        str = this.value + mask.format.charAt(pos - 1) + ch;
      }
      this.value = str;
      keyAllowed = true;
    }
    if (typeof ev.which == 'undefined') {
      window.event.keyCode = 0;
    } else {
      ev.preventDefault();
      ev.stopPropagation();
      ev.returnValue = false;
    }
    return keyAllowed;
  },
  
  displayAlert: function(messages, alertType) {
    var retval = null;
    yav.clearAllInlinespans();
    if (alertType == 'classic') {
      retval = yav.displayClassic(messages);
    } else if (alertType == 'innerHtml') {
      retval = yav.displayInnerHtml(messages);
    } else if (alertType == 'inline') {
      retval = yav.displayInline(messages);
    } else if (alertType == 'jsvar') {
      retval = yav.displayJsvar(messages);
    } else {
      yav.debug('DEBUG: alert type ' + alertType + ' not supported');
    }
    return retval;
  },
  

displayClassic: function(messages) {
    var str = '';
    if (messages != null && messages.length > 0) {
      if (yav.strTrim(yav_config.HEADER_MSG).length > 0) {
        str += yav_config.HEADER_MSG + '\n\n';
      }
      for (var i = 0; i < messages.length; i++) {
        str += ' ' + yav.deleteInline(messages[i]) + '\n';
      }
      if (yav.strTrim(yav_config.FOOTER_MSG).length > 0) {
        str += '\n' + yav_config.FOOTER_MSG;
      }
      alert(str);
      return false;
    } else {
      return true;
    }
  },
  
  displayInnerHtml: function(messages) {
    if (messages != null && messages.length > 0) {
      var str = '';
      if (yav.strTrim(yav_config.HEADER_MSG).length > 0) {
        str += yav_config.HEADER_MSG;
      }
      str += '<ul>';
      for (var i = 0; i < messages.length; i++) {
        str += '<li>' + yav.deleteInline(messages[i]) + '</li>';
      }
      str += '</ul>';
      if (yav.strTrim(yav_config.FOOTER_MSG).length > 0) {
        str += yav_config.FOOTER_MSG;
      }
      yav.get(yav_config.errorsdiv).innerHTML = str;
      yav.get(yav_config.errorsdiv).className = yav_config.innererror;
      yav.get(yav_config.errorsdiv).style.display = 'block';
      return false;
    } else {
      yav.get(yav_config.errorsdiv).innerHTML = '';
      yav.get(yav_config.errorsdiv).className = '';
      yav.get(yav_config.errorsdiv).style.display = 'none';
      return true;
    }
  },
  
  displayInline: function(messages) {
    if (messages != null && messages.length > 0) {
      var genericErrors = [];
      var genericErrIndex = 0;
      for (var i = 0; i < messages.length; i++) {
        var elName = messages[i].substring(messages[i].indexOf('_inline_') + 10);
        if (yav.get(yav_config.errorsdiv + '_' + elName)) {
          yav.get(yav_config.errorsdiv + '_' + elName).innerHTML = yav.deleteInline(messages[i]);
          yav.get(yav_config.errorsdiv + '_' + elName).className = yav_config.innererror;
          yav.get(yav_config.errorsdiv + '_' + elName).style.display = '';
        } else {
          genericErrors[genericErrIndex] = messages[i];
          genericErrIndex++;
        }
      }
      if (genericErrIndex > 0) {
        yav.displayInnerHtml(genericErrors);
        return false;
      } else {
        return true;
      }
    }
  },
  
  clearAllInlinespans: function() {
    var allDivs = document.getElementsByTagName("span");
    for (var j = 0; j < allDivs.length; j++) {
      var idName = allDivs[j].id;
      if (idName.indexOf(yav_config.errorsdiv + '_') == 0) {
        if (yav.filterByName != null) {
          if (idName == yav_config.errorsdiv + '_' + yav.filterByName) {
            yav.get(idName).innerHTML = '';
            yav.get(idName).className = '';
            yav.get(idName).style.display = 'none';
          }
        } else {
          yav.get(idName).innerHTML = '';
          yav.get(idName).className = '';
          yav.get(idName).style.display = 'none';
        }
      }
    }
  },
  
  clearInlineSpans: function() {
    var allDivs = document.getElementsByTagName("span");
    for (var j = 0; j < allDivs.length; j++) {
      var idName = allDivs[j].id;
      if (idName.indexOf(yav_config.errorsdiv + '_') == 0) {
        for (var k = 0; k < arguments.length; k++) {
          if (idName == yav_config.errorsdiv + '_' + arguments[k]) {
            yav.get(idName).innerHTML = '';
            yav.get(idName).className = '';
            yav.get(idName).style.display = 'none';
          }
        }
      }
    }
  },
  
  displayJsvar: function(messages) {
    var errorsDiv = yav.get(yav_config.errorsdiv);
    errorsDiv.className = '';
    errorsDiv.style.display = 'none';
  
    if (messages != null && messages.length > 0) {
      for (var i = 0; i < messages.length; i++) {
        messages[i] = yav.deleteInline(messages[i]);
      }
      var str = '<script>var jsErrors;</script>';
      errorsDiv.innerHTML = str;
      jsErrors = messages;
      return false;
    } else {
      errorsDiv.innerHTML = '<script>var jsErrors;</script>';
      return true;
    }
  },
  
  rule: function(el, ruleName, comparisonValue, alertMsg, ruleType) {
    if (el == null || ruleName == null) {
      return false;
    }
  
    var tmp = el.split(':');
    var nameDisplayed = '';
    if (tmp.length === 2) {
      nameDisplayed = tmp[1];
      el = tmp[0];
    }
  
    this.el = el;
    this.nameDisplayed = nameDisplayed;
    this.ruleName = ruleName;
    this.comparisonValue = comparisonValue;
    this.ruleType = ruleType;
  
    if (alertMsg == yav.undef || alertMsg == null) {
      this.alertMsg = yav.getDefaultMessage(el, nameDisplayed, ruleName, comparisonValue) + '_inline_' + this.el;
    } else {
      this.alertMsg = alertMsg + '_inline_' + this.el;
    }
  },
  
  checkRule: function(f, myRule) {
    if (myRule == null) {
      return null;
    }
  
    var retval = null;
    if (myRule.ruleName === 'custom') {
      var customFunction = myRule.comparisonvalue != null ? 'retval = ' + myRule.comparisonvalue : 'retval = ' + myRule.el;
      retval = eval(customFunction);
      if (myRule.comparisonvalue != null && retval !== this.undef && retval !== null) {
        retval += '_inline_' + myRule.el;
        if (retval !== null && myRule.comparisonValue != null) {
          yav.highlight(yav.getField(yav.f, myRule.el), yav_config.inputclasserror);
        }
      }
    } else if (myRule.ruleName === 'and') {
      var op_1 = myRule.el;
      var op_next = myRule.comparisonvalue;
      if (this.checkRule(f, yav.internalRules[op_1]) !== null) {
        retval = myRule.alertMsg;
        if (myRule.ruleType === 'pre-condition' || myRule.ruleType === 'andor-operator') {
          // yav.highlight(yav.getField(f, yav_config.inputclasserror);
        } else {
          var op_k = op_next.split('-');
          for (var k = 0; k < op_k.length; k++) {
            if (this.checkRule(f, yav.internalRules[op_k[k]]) !== null) {
              retval = myRule.alertMsg;
              if (myRule.ruleType === 'pre-condition' || myRule.ruleType === 'andor-operator') {
                // yav.highlight(yav.getField(f, yav.internalRules[op_k[k]].e1), yav_config.inputclasserror);
              }
              break;
            }
          }
        }
      }
    } else if (myRule.ruleName === 'or') {
      var op_1 = myRule.el;
      var op_next = myRule.comparisonvalue;
      var success = false;
      if (this.checkRule(f, yav.internalRules[op_1]) == null) {
        success = true;
      } else {
        if (myRule.ruleType === 'pre-condition' || myRule.ruleType === 'andor-operator') {
          // yav.highlight(yav.getField(f, yav.internalRules[op_1].el), yav_config.inputclasserror);
          var op_k = op_next.split('-');
          for (var k = 0; k < op_k.length; k++) {
            if (this.checkRule(f, yav.internalRules[op_k[k]]) == null) {
              success = true;
              break;
            } else {
              if (myRule.ruleType === 'pre-condition' || myRule.ruleType === 'andor-operator') {
                // yav.internalRules[op_k[k]].e), vav chlight(yav.getField(f, yav_config.inputclasserror);
              }
            }
          }
          if (success) {
            yav.highlight(yav.getField(f, yav.internalRules[op_1].el), yav_config.inputclassnormal);
            var op_k = op_next.split('-');
            for (var k = 0; k < op_k.length; k++) {
              yav.highlight(yav.getField(f, yav.internalRules[op_k[k]].el), yav_config.inputclassnormal);
            }
          } else {
            retval = myRule.alertMsg;
          }
        } else {
          var el = yav.getField(f, myRule.el);
          if (el == null) {
            yav.debug('DEBUG: could not find element ' + myRule.el);
            return null;
          }
          var err = null;
          if (el.type) {
            if (el.type === 'hidden' || el.type === 'text' || el.type === 'password' || el.type === 'textarea') {
              err = yav.checkText(el, myRule);
            } else if (el.type === 'checkbox') {
              err = yav.checkCheckbox(el, myRule);
            } else if (el.type === 'select-one') {
              err = yav.checkselone(el, myRule);
            } else if (el.type === 'select-multiple') {
              err = yav.checkselMul(el, myRule);
            } else if (el.type === 'radio') {
              err = yav.checkRadio(el, myRule);
            }
          } else {
            err = yav.checkRadio(el, myRule);
          }
          retval = err;
        }
      }
    } else {
      yav.debug('DEBUG: ruleName ' + myRule.ruleName + ' not supported');
    }
    return retval;
  },
  
  checkRadio: function(el, myRule) {
    var err = null;
    if (myRule.ruleName === 'required') {
      var radios = el;
      var found = false;
      if (isNaN(radios.length) && radios.checked) {
        found = true;
      } else {
        for (var j = 0; j < radios.length; j++) {
          if (radios[j].checked) {
            found = true;
            break;
          }
        }
      }
      if (!found) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'equal') {
      var radios = el;
      var found = false;
      if (isNaN(radios.length) && radios.checked) {
        if (radios.value === myRule.comparisonvalue) {
          found = true;
        }
      } else {
        for (var j = 0; j < radios.length; j++) {
          if (radios[j].checked) {
            if (radios[j].value === myRule.comparisonvalue) {
              found = true;
              break;
            }
          }
        }
      }
      if (!found) {
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'notequal') {
      var radios = el;
      var found = false;
      if (isNaN(radios.length) && radios.checked) {
        if (radios.value !== myRule.comparisonvalue) {
          found = true;
        }
      } else {
        for (var j = 0; j < radios.length; j++) {
          if (radios[j].checked) {
            if (radios[j].value !== myRule.comparisonvalue) {
              found = true;
              break;
            }
          }
        }
      }
      if (!found) {
        err = myRule.alertMsg;
      }
    } else {
      yav.debug('DEBUG: rule ' + myRule.ruleName + ' not supported for radio');
    }
    return err;
  },  
      

ccheckText: function(el, myRule) {
    var err = null;
    if (yav_config.trimenabled) {
      el.value = yav.strTrim(el.value);
    }
    if (myRule.ruleName === 'required') {
      if (el.value == null || el.value === '') {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'equal') {
      err = yav.checkEqual(el, myRule);
    } else if (myRule.ruleName === 'notequal') {
      err = yav.checkNotEqual(el, myRule);
    } else if (myRule.ruleName === 'numeric') {
      var reg = new RegExp("^[0-9]*$");
      if (!reg.test(el.value)) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'alphabetic') {
      var reg = new RegExp(yav_config.alphabetic_regex);
      if (!reg.test(el.value)) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'alphanumeric') {
      var reg = new RegExp(yav_config.alphanumeric_regex);
      if (!reg.test(el.value)) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'alnumhyphen') {
      var reg = new RegExp(yav_config.alnumhyphen_regex);
      if (!reg.test(el.value)) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'alnumhyphenat') {
      var reg = new RegExp(yav_config.alnumhyphenat_regex);
      if (!reg.test(el.value)) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'alphaspace') {
      var reg = new RegExp(yav_config.alphaspace_regex);
      if (!reg.test(el.value)) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'email') {
      var reg = new RegExp(yav_config.email_regex);
      if (!reg.test(el.value)) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'maxlength') {
      if (isNaN(myRule.comparisonvalue)) {
        yav.debug('DEBUG: comparisonvalue for rule ' + myRule.ruleName + ' not a number');
      } else if (el.value.length > myRule.comparisonvalue) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'minlength') {
      if (isNaN(myRule.comparisonvalue)) {
        yav.debug('DEBUG: comparisonvalue for rule ' + myRule.ruleName + ' not a number');
      } else if (el.value.length < myRule.comparisonvalue) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'numrange') {
      var reg = new RegExp("^[+]{0,1}[0-9]*[.]{0,1}[0-9]*$");
      if (!reg.test(yav.unformatNumber(el.value))) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      } else {
        var regRange = new RegExp("^[0-9]+-[0-9]+$");
        if (!regRange.test(myRule.comparisonvalue)) {
          yav.debug('DEBUG: comparisonvalue for rule ' + myRule.ruleName + ' not in format number1-number2');
        } else {
          var rangeval = myRule.comparisonvalue.split('-');
          if (eval(yav.unformatNumber(el.value)) < eval(rangeval[0]) || eval(yav.unformatNumber(el.value)) > eval(rangeval[1])) {
            yav.highlight(el, yav_config.inputclasserror);
            err = myRule.alertMsg;
          }
        }
      }
    } else if (myRule.ruleName === 'regexp') {
      var reg = new RegExp(myRule.comparisonvalue);
      if (!reg.test(el.value)) {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else if (myRule.ruleName === 'integer') {
      err = yav.checkInteger(el, myRule);
    } else if (myRule.ruleName === 'double') {
      err = yav.checkDouble(el, myRule);
    } else if (myRule.ruleName === 'date') {
      err = yav.checkDate(el, myRule);
    } else if (myRule.ruleName === 'date_le') {
      err = yav.checkDateLessThan(el, myRule, false);
    } else if (myRule.ruleName === 'date_le') {
      err = yav.checkDateLessThan(el, myRule, true);
    } else if (myRule.ruleName === 'keypress') {
      // do something for keypress rule
    } else if (myRule.ruleName === 'empty') {
      if (el.value != null && el.value !== '') {
        yav.highlight(el, yav_config.inputclasserror);
        err = myRule.alertMsg;
      }
    } else {
      yav.debug('DEBUG: rule ' + myRule.ruleName + ' not supported for ' + el.type);
    }
    return err;
  },
  

  checkInteger: function(el, myRule) {
    var reg = new RegExp("^[-+]?[0-9]+$");
    if (!reg.test(el.value)) {
      yav.highlight(el, yav_config.inputclasserror);
      return myRule.alertMsg;
    }
  },
  
  checkDouble: function(el, myRule) {
    var sep = yav_config.DECIMAL_SEP;
    var reg = new RegExp("^[-+]?[0-9]*\\" + sep + "?[0-9]+$");
    if (!reg.test(el.value)) {
      yav.highlight(el, yav_config.inputclasserror);
      return myRule.alertMsg;
    }
  },
  
  checkDate: function(el, myRule) {
    var error = null;
    if (el.value === '') {
      var dateFormat = yav_config.DATE_FORMAT;
      var ddReg = new RegExp("dd");
      var MMReg = new RegExp("MM");
      var yyyyReg = new RegExp("yyyy");
      if (!ddReg.test(dateFormat) || !MMReg.test(dateFormat) || !yyyyReg.test(dateFormat)) {
        yav.debug('DEBUG: locale format ' + dateFormat + ' not supported');
      } else {
        var ddStart = dateFormat.indexOf('dd');
        var MMStart = dateFormat.indexOf('MM');
        var yyyyStart = dateFormat.indexOf('yyyy');
      }
  
      var strReg = dateFormat.replace('dd', '[0-9]{2}').replace('MM', '[0-9]{2}').replace('yyyy', '[0-9]{4}');
      var reg = new RegExp("^" + strReg + "$");
      if (!reg.test(el.value)) {
        yav.highlight(el, yav_config.inputclasserror);
        error = myRule.alertMsg;
      } else {
        var dd = el.value.substring(ddStart, ddStart + 2);
        var MM = el.value.substring(MMStart, MMStart + 2);
        var yyyy = el.value.substring(yyyyStart, yyyyStart + 4);
        if (!yav.checkddMMyyyy(dd, MM, yyyy)) {
          yav.highlight(el, yav_config.inputclasserror);
          error = myRule.alertMsg;
        }
      }
    }
    return error;
  },
  

  checkEqual: function(el, myRule) {
    var error = null;
    var isMeta = myRule.comparisonvalue.indexOf('$') == 0 ? true : false;
    var comparisonval = '';
    if (isMeta) {
      var tosplit = myRule.comparisonvalue.substr(1);
      var tmp = tosplit.split(':');
      if (tmp.length == 2) {
        comparisonval = yav.getField(yav.f, tmp[0]).value;
      } else {
        comparisonval = yav.getField(yav.f, myRule.comparisonvalue.substr(1)).value;
      }
    } else {
      comparisonval = myRule.comparisonvalue;
      if (el.value != comparisonval) {
        yav.highlight(el, yav_config.inputclasserror);
        error = myRule.alertMsg;
      }
    }
    return error;
  },
  
  checkNotEqual: function(el, myRule) {
    var error = null;
    var isMeta = myRule.comparisonvalue.indexOf('$') == 0 ? true : false;
    var comparisonval = '';
    if (isMeta) {
      var tosplit = myRule.comparisonvalue.substr(1);
      var tmp = tosplit.split(':');
      if (tmp.length == 2) {
        comparisonval = yav.getField(yav.f, tmp[0]).value;
      } else {
        comparisonval = yav.getField(yav.f, myRule.comparisonvalue.substr(1)).value;
      }
    } else {
      comparisonval = myRule.comparisonvalue;
    }
    if (el.value != comparisonval) {
      yav.highlight(el, yav_config.inputclasserror);
      error = myRule.alertMsg;
    }
    return error;
  },
  
  checkddMMyyyy: function(dd, MM, yyyy) {
    var retVal = true;
    if (
      dd < 1 ||
      dd > 31 ||
      MM < 1 ||
      MM > 12 ||
      (dd == 31 &&
        (MM == 2 || MM == 4 || MM == 6 || MM == 9 || MM == 11)) ||
      (dd > 29 && MM == 2) ||
      (dd == 29 && MM == 2 && (yyyy % 4 > 0)) ||
      (yyyy % 4 == 0 && yyyy % 100 == 0 && yyyy % 400 > 0)
    ) {
      retVal = false;
    }
    return retVal;
  },
  
  checkCheckbox: function(el, myRule) {
    if (myRule.ruleName == 'required') {
      if (!el.checked) {
        yav.highlight(el, yav_config.inputclasserror);
        return myRule.alertMsg;
      }
    } else if (myRule.ruleName == 'equal') {
      if (!el.checked || el.value != myRule.comparisonvalue) {
        yav.highlight(el, yav_config.inputclasserror);
        return myRule.alertMsg;
      }
    } else if (myRule.ruleName == 'notequal') {
      if (el.checked && el.value == myRule.comparisonvalue) {
        yav.highlight(el, yav_config.inputclasserror);
        return myRule.alertMsg;
      }
    } else {
      yav.debug('DEBUG: rule ' + myRule.ruleName + ' not supported for ' + el.type);
    }
  },
  
  checkselone: function(el, myRule) {
    if (myRule.ruleName == 'required') {
      var found = false;
      var inx = el.selectedIndex;
      if (inx >= 0 && el.options[inx].value) {
        found = true;
      }
      if (!found) {
        yav.highlight(el, yav_config.inputclasserror);
        return myRule.alertMsg;
      }
    } else if (myRule.ruleName == 'equal') {
      var found = false;
      var inx = el.selectedIndex;
      if (inx >= 0 && el.options[inx].value == myRule.comparisonvalue) {
        found = true;
        if (!found) {
          yav.highlight(el, yav_config.inputclasserror);
          return myRule.alertMsg;
        }
      }
    } else if (myRule.ruleName == 'notequal') {
      var found = false;
      var inx = el.selectedIndex;
      if (inx >= 0 && el.options[inx].value != myRule.comparisonvalue) {
        found = true;
        if (!found) {
          yav.highlight(el, yav_config.inputclasserror);
          return myRule.alertMsg;
        }
      }
    } else {
      yav.debug('DEBUG: rule ' + myRule.ruleName + ' not supported for ' + el.type);
    }
  },
  
  checkselMul: function(el, myRule) {
    if (myRule.ruleName == 'required') {
      var found = false;
      var opts = el.options;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].selected && opts[i].value) {
          found = true;
          break;
        }
      }
      if (!found) {
        yav.highlight(el, yav_config.inputclasserror);
        return myRule.alertMsg;
      }
    } else if (myRule.ruleName == 'equal') {
      var found = false;
      var opts = el.options;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].selected && opts[i].value == myRule.comparisonvalue) {
          found = true;
          break;
        }
      }
      if (!found) {
        yav.highlight(el, yav_config.inputclasserror);
        return myRule.alertMsg;
      }
    } else if (myRule.ruleName == 'notequal') {
      var found = false;
      var opts = el.options;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].selected && opts[i].value != myRule.comparisonvalue) {
          found = true;
          break;
        }
      }
      if (!found) {
        yav.highlight(el, yav_config.inputclasserror);
        return myRule.alertMsg;
      }
    } else {
      yav.debug('DEBUG: rule ' + myRule.ruleName + ' not supported for ' + el.type);
    }
  },
  
  strTrim: function(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  },
  
  makeRules: function(strRules) {
    var rules = new Array();
    if (strRules.length) {
      for (var i = 0; i < strRules.length; i++) {
        rules[i] = yav.splitRule(strRules[i]);
      }
    } else {
      rules[0] = yav.splitRule(strRules);
    }
    return rules;
  },
  
  splitRule: function(strRule) {
    var retval = null;
    if (strRule != yav.undef) {
      var params = strRule.split(yav_config.RULE_SEP);
      switch (params.length) {
        case 2:
          retval = new yav.rule(params[0], params[1], null, null, null);
          break;
        case 3:
          if (yav.threeParamRule(params[1])) {
            retval = new yav.rule(params[0], params[1], params[2], null, null);
          } else if (params[2] == 'pre-condition' || params[2] == 'post-condition' || params[2] == 'andor-operator') {
            retval = new yav.rule(params[0], params[1], null, 'foo', params[2]);
          } else {
            retval = new yav.rule(params[0], params[1], null, params[2], null);
          }
          break;
        case 4:
          if (yav.threeParamRule(params[1]) && (params[3] == 'pre-condition' || params[3] == 'post-condition' || params[3] == 'andor-operator')) {
            retval = new yav.rule(params[0], params[1], params[2], 'foo', params[3]);
          } else {
            retval = new yav.rule(params[0], params[1], params[2], params[3], null);
          }
          break;
        default:
          yav.debug('DEBUG: wrong definition of rule');
      }
    }
    return retval;
  },
  

  threeParamRule: function(ruleName) {
    return (
      ruleName == 'equal' ||
      ruleName == 'notequal' ||
      ruleName == 'minlength' ||
      ruleName == 'maxlength' ||
      ruleName == 'date_lt' ||
      ruleName == 'date_le' ||
      ruleName == 'implies' ||
      ruleName == 'regexp' ||
      ruleName == 'numrange' ||
      ruleName == 'keypress' ||
      ruleName == 'mask' ||
      ruleName == 'and' ||
      ruleName == 'or' ||
      ruleName == 'custom'
    );
  },
  
  highlight: function(el, clazz) {
    if (yav.rulesEvt.length > 0 && clazz == yav_config.inputclasserror) {
      return;
    }
    if (!yav.isFocusSet && clazz == yav_config.inputclasserror) {
      if (!el.type && el.length > 0 && el.item(0).type == 'radio') {
        el.item(0).focus();
      } else {
        el.focus();
      }
      yav.isFocusSet = true;
    }
    if (el != yav.undef && yav_config.inputhighlight) {
      if (yav_config.multipleclassname) {
        yav.highlightMultipleClassName(el, clazz);
      } else {
        el.className = clazz;
      }
    }
  },
  
  highlightMultipleClassName: function(el, clazz) {
    var re = new RegExp("(^\\s)(" + yav_config.inputclassnormal + "|" + yav_config.inputclasserror + ")($\\s)");
    el.className = yav.strTrim((typeof el.className != "undefined" ? el.className.replace(re, "") : " ") + " " + clazz);
  },
  
  getDefaultMessage: function(el, nameDisplayed, ruleName, comparisonvalue) {
    if (nameDisplayed.length == 0) {
      nameDisplayed = el;
    }
    var msg = yav_config.DEFAULT_MSG;
    if (ruleName == 'required') {
      msg = yav_config.REQUIRED_MSG.replace('{1}', nameDisplayed);
    } else if (ruleName == 'minlength') {
      msg = yav_config.MINLENGTH_MSG.replace('{1}', nameDisplayed).replace('{2}', comparisonvalue);
    } else if (ruleName == 'maxlength') {
      msg = yav_config.MAXLENGTH_MSG.replace('{1}', nameDisplayed).replace('{2}', comparisonvalue);
    } else if (ruleName == 'numrange') {
      msg = yav_config.NUMRANGE_MSG.replace('{1}', nameDisplayed).replace('{2}', comparisonvalue);
    } else if (ruleName == 'date') {
      msg = yav_config.DATE_MSG.replace('{1}', nameDisplayed);
    } else if (ruleName == 'numeric') {
      msg = yav_config.NUMERIC_MSG.replace('{1}', nameDisplayed);
    } else if (ruleName == 'integer') {
      msg = yav_config.INTEGER_MSG.replace('{1}', nameDisplayed);
    } else if (ruleName == 'double') {
      msg = yav_config.DOUBLE_MSG.replace('{1}', nameDisplayed);
    } else if (ruleName == 'equal') {
      msg = yav_config.EQUAL_MSG.replace('{1}', nameDisplayed).replace('{2}', yav.getComparisonDisplayed(comparisonvalue));
    } else if (ruleName == 'notequal') {
      msg = yav_config.NOTEQUAL_MSG.replace('{1}', nameDisplayed).replace('{2}', yav.getComparisonDisplayed(comparisonvalue));
    } else if (ruleName == 'alphabetic') {
      msg = yav_config.ALPHABETIC_MSG.replace('{1}', nameDisplayed);
    } else if (ruleName == 'alphanumeric') {
      msg = yav_config.ALPHANUMERIC_MSG.replace('{1}', nameDisplayed);
    } else if (ruleName == 'alnumhyphen') {
      msg = yav_config.ALNUMHYPHEN_MSG.replace('{1}', nameDisplayed);
    } else if (ruleName == 'alnumat') {
      msg = yav_config.ALNUMAT_MSG.replace('{1}', nameDisplayed);
    } else if (ruleName == 'email') {
      msg = yav_config.EMAIL_MSG.replace('{1}', nameDisplayed);
    } else if (ruleName == 'regexp') {
      msg = yav_config.REGEXP_MSG.replace('{1}', nameDisplayed).replace('{2}', comparisonvalue);
    } else if (ruleName == 'date_lt') {
      msg = yav_config.DATE_LT_MSG.replace('{1}', nameDisplayed).replace('{2}', yav.getComparisonDisplayed(comparisonvalue));
    } else if (ruleName == 'date_le') {
      msg = yav_config.DATE_LE_MSG.replace('{1}', nameDisplayed).replace('{2}', yav.getComparisonDisplayed(comparisonvalue));
    } else if (ruleName == 'empty') {
      msg = yav_config.EMPTY_MSG.replace('{1}', nameDisplayed);
    }
    return msg;
  },
  
  getComparisonDisplayed: function(comparisonvalue) {
    var comparisonDisplayed = comparisonvalue;
    if (comparisonvalue.substring(0, 1) == 'S') {
      comparisonvalue = comparisonvalue.substring(1, comparisonvalue.length);
      var tmp = comparisonvalue.split(':');
      if (tmp.length == 2) {
        comparisonDisplayed = tmp[1];
      }
    }
    return comparisonDisplayed;
  },
  
  iskeyAllowed: function(keyCode, charsAllowed) {
    var retval = false;
    var acharCode;
    if (keyCode == 8 || keyCode == 0) {
      retval = true;
    } else {
      for (var i = 0; i < charsAllowed.length; i++) {
        acharCode = charsAllowed.charCodeAt(i);
        if (acharCode == keyCode) {
          retval = true;
          break;
        }
      }
    }
    return retval;
  },
  

  getField: function(formobj, fieldName) {
    var retval = null;
    if (formobj.elements[fieldName]) {
      retval = formobj.elements[fieldName];
    } else if (yav.get(fieldName)) {
      retval = yav.get(fieldName);
    }
    return retval;
  },
  
  get: function(id) {
    return document.getElementById(id);
  },
  
  unformatNumber: function(viewvalue) {
    var retval = viewvalue.replace(yav_config.THOUSAND_SEP, "");
    retval = retval.replace(yav_config.DECIMAL_SEP, ".");
    return retval;
  },
  
  deleteInline: function(msg) {
    if (msg.indexOf('_inline_') == -1) {
      return msg;
    } else {
      return msg.substring(0, msg.indexOf('__inline__'));
    }
  },
  
  addEvent: function(elm, evType, fn) {
    if (elm.addEventListener) {
      elm.addEventListener(evType, fn, false);
      return true;
    } else if (elm.attachEvent) {
      // The main drawback of the Microsoft event registration model is
      // attachEvent() creates a reference to the function and does not
      // so these lines (commented out) don't work in some circumstances. 
      // var r = elm.attachEvent('on' + evType, fn);
      // return r
      elm['on' + evType] = fn;
    } else {
      elm['on' + evType] = fn;
    }
  },
  
  call: function(elmName, evType, fn) {
    var elm = document.forms[yav.formEvt].elements[elmName];
    yav.addEvent(elm, evType, fn);
  },
  
Function.prototype.bindAsEventListener = function(object) {
  var __method = this;
  return function(event) {
    return __method.call(object, event || window.event);
  }.bind(object);
}

  