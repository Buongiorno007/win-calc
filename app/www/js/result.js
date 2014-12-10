
// result.js

/* exported OkResult, ErrorResult */

"use strict";

function OkResult(data) {
  this.status = true;
  this.data = data;
}

function ErrorResult(code, message) {
  this.status = false;
  this.code = code;
  this.message = message;

  console.error(this.code, this.message);
}
