// Copied form http://jsperf.com/cloning-an-object/2
module.exports.clone = function clone(obj) {
 var target = {};
 for (var i in obj) {
  if (obj.hasOwnProperty(i)) {
   target[i] = obj[i];
  }
 }
 return target;
}