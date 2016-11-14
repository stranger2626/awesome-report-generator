'use strict';

const fs = require('fs');
const path = require('path');
var _ = require('lodash');
var xl = require('excel4node');
var reporter = require('cucumber-html-reporter');

module.exports.run = (config) => {
    let data = require(path.resolve(config.input));
var suite = {
       
        time: new Date().toLocaleString(),
        features: data,
        passed: 0,
        failed: 0,
        totalTime: 0,
        scenarios: {
            passed: 0,
            failed: 0,
            skipped: 0,
            notdefined: 0
        }
    };

    

    var ensureDirectoryExistence = function(filePath) {
        var dirname = path.dirname(filePath);
        if (directoryExists(dirname)) {
            return true;
        }
        ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    };

    var directoryExists = function(path) {
        try {
            return fs.statSync(path).isDirectory();
        } catch (err) {
            return false;
        }
    };
    data.summary = {
        isFailed: false,
        passed: 0,
        failed: 0
    };

   
    var htmlReport = function() {
        var options = {
        theme: 'foundation',
        jsonFile: 'e2e/output/cucumber.json',
        output: 'e2e/output/cucumber_report.html',
        reportSuiteAsScenarios: true,
        launchReport: true
    };
    reporter.generate(options);
    };
    var xlsReport = function() {

        var wb = new xl.Workbook();
        var ws = wb.addWorksheet('Sheet 1');

        ws.column(2).setWidth(20);
        ws.column(3).setWidth(40);

        var xlsxoutputFile = './e2e/output/report.xlsx';
        ensureDirectoryExistence(xlsxoutputFile);
        var header = "Protractor results for: " + (new Date()).toLocaleString() + "\n\n";
        wb.write(xlsxoutputFile);
        ws.cell(2, 1, 2, 3, true).string(header);


        var i = 4;

        _.forEach(suite.features, function(feature) {
            ws.cell(++i, 1).string(feature.keyword);
            ws.cell(i, 2).string(feature.name);
            
            _.forEach(feature.elements, function(element) {
                if (element.name != undefined) {
                    ws.cell(++i, 1).string(element.keyword);
                    ws.cell(i, 2).string(element.name);
                }
                _.forEach(element.steps, function(step) {
                    if (step.result) {
                        if (step.name != undefined) {
                            ws.cell(++i, 1).string(step.result.status);
                            ws.cell(i, 2).string(step.keyword);
                            ws.cell(i, 3).string(step.name);
                        }
                    }
                    if (step.text) {
                        ws.cell(i, 4).string(step.text);
                    }

                });
            });
        });

        return wb.write(xlsxoutputFile);


    }
    _.forEach(config.format, function(format) {
        switch (format) {
            case 'html':
                htmlReport();
                break;
            case 'xlsx':
                xlsReport();
                break;
        }
    });

};