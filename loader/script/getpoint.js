phantom.outputEncoding = "GBK";
var casper = new require('casper').create({
    verbose: true,
    //   logLevel: "debug",
    viewportSize: {
        width: 1920,
        height: 1200
    }
});
var utils = require('utils');
var fs = require('fs');
var resourceDirectory = "capture/";

var result = 0;

var bHaveImage = true;

var urls = [];

var login_url = "http://lbtoo.com/";
var home_url = "http://lbtoo.com/resume/search2";

// evilhack2000@tom.com :　evil2000
// evilhack2001@tom.com :　evil2001

var user = casper.cli.get("user") || "saiyan.wang@hotmail.com";
var password = casper.cli.get("password") || "wang123456";

var start_node = casper.cli.get("start") || 1;
var end_node = casper.cli.get("end") || 7;

function saveimage(filename) {
    if (bHaveImage) {
        casper.capture(resourceDirectory + filename + '.png');
    }
}

casper.on("http.status.200", function(resource) {
    this.log(resource.url + " is OK", "INFO");
});

casper.on("http.status.301", function(resource) {
    this.log(resource.url + " is permanently redirected", "PARAMETER");
});

casper.on("http.status.302", function(resource) {
    this.log(resource.url + " is temporarily redirected", "PARAMETER");
});

casper.on("http.status.404", function(resource) {
    this.log(resource.url + " is not found", "COMMENT");
});

casper.on("http.status.500", function(resource) {
    this.log(resource.url + " is in error", "ERROR");
});

casper.start(login_url, function() {
    if (this.exists('input.GlzDengLuName')) {
        this.sendKeys('input.GlzDengLuName', user);
    } else {
        saveimage("Failed_enter_email");
    }
    if (this.exists('input.GlzDengLuName.GlzDengLuName1')) {
        this.sendKeys('input.GlzDengLuName.GlzDengLuName1', password);
    } else {
        saveimage("failed_enter_password");
    }
});

casper.then(function() {
    if (this.exists('#login_bt')) {
        this.click('#login_bt');
    } else {
        saveimage("failed_sumbit_login");
    }
});

casper.then(function() {
    if (this.getCurrentUrl() == home_url) {
        //      result = 1;
    } else {

        saveimage("failed_in_home_page");
    }
});

casper.then(function() {
    //   http://lbtoo.com/resume/isCheck?type=5&count=300&glzcount=5
    var base_url = "http://lbtoo.com/resume/isCheck?type=";
    for (var i = start_node; i < end_node; i++) {
        urls.push(base_url + i + "&count=300&glzcount=5");
    }
    //  this.echo(urls);
    casper.each(urls, function(self, link) {
        self.thenOpen(link, function(response) {
            casper.echo(link + ", get point : " + this.getHTML('body'), "INFO");
        })
    });

    //    result = 1;
});

casper.thenOpen(home_url, function() {
    //   this.echo(this.getCurrentUrl());
    //   utils.dump(this.getElementInfo('#goldShovelCount')["text"]);
//    this.echo(this.getElementInfo('#goldShovelCount')["text"]);
    result = this.getElementInfo('#goldShovelCount')["text"];

})



casper.run(function() {
    //   this.echo(start_node + ":" + end_node);
    this.echo(result);
    this.exit(result);
});