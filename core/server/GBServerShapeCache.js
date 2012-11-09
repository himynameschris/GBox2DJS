/****************************************************************************
 Copyright (c) 2012 - Chris Hannon / http://www.channon.us

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var Box2D = require('./../../lib/cocos2d-html5/box2d/box2d.js');

// Shorthand "imports"
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2AABB = Box2D.Collision.b2AABB,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
    b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape;
b2ContactListener = Box2D.Dynamics.b2ContactListener;

var g_gbservershapecacheinstance = null;

var fs = require('fs'),
    xml2js = require('xml2js');

(function(){

    /**
     implementing the GBServerNet class, a singleton to handle management of the
     node.js express server and socket.io

     */
    GBox2D.server.GBServerShapeCache = function() {
        this.bodies = new SortedLookupTable();
    };

    GBox2D.server.GBServerShapeCache.prototype = {
        cache : null,
        start : false,
        cb : null,
        ptm : 32,
        bodies : null,
        resourceFolder : null,
        getInstance : function() {
            if (g_gbservershapecacheinstance == null)
            {
                g_gbservershapecacheinstance = new GBox2D.server.GBServerShapeCache();
                g_gbservershapecacheinstance.init();
            }

            return g_gbservershapecacheinstance;
        },
        init : function() {

            this.parser = new xml2js.Parser({mergeAttrs : true,
                                                explicitRoot : false,
                                                explicitArray: false});

            this.parser.addListener('end', this.doneParsing);

        },

        addFixturesToBody : function(body, shape) {

            var def = g_gbservershapecacheinstance.bodies.objectForKey(shape);

            if(def !==undefined){

                for(var fixDef in def.fixDefs) {

                    var fix = def.fixDefs[fixDef];

                    body.CreateFixture(fix);

                }
            }

        },
        loadFromFile : function(filename, instance, cb) {
            if (cb !== 'undefined') {
                instance.start = true;
                instance.cb = cb;
                console.log('start set');
            }

            fs.readFile(g_gbservershapecacheinstance.resourceFolder + filename + '.xml', function(err, data) {
                console.log(data);
                instance.parser.parseString(data);
            });

        },

        doneParsing : function(result) {
            this.ptmRatio = result.metadata.ptm_ratio;

            for(var body in result.bodies.body)
            {

                //console.log(result.bodies.body[body].name);
                var bodyDef = result.bodies.body[body];
                var entity = {};
                var fixDefs = [];
                entity.name = bodyDef.name;
                entity.anchorpoint = bodyDef.anchorpoint;

                for(var fixture in bodyDef.fixtures) {
                    var fixDef = bodyDef.fixtures[fixture];

                        if(fixDef.length !== undefined) {

                            for(var fixID in fixDef) {
                                console.log(fixID);
                                var arrFixture = fixDef[fixID];

                                if(arrFixture.fixture_type == "POLYGON") {

                                    if(arrFixture.polygons.polygon.length === undefined) {
                                        polyDef = arrFixture.polygons.polygon;

                                        var fix = new b2FixtureDef;
                                        var vertices = [];

                                        fix.density = parseFloat(arrFixture.density);
                                        fix.friction = parseFloat(arrFixture.friction);
                                        fix.restitution = parseFloat(arrFixture.restitution);
                                        fix.filter.categoryBits = parseFloat(arrFixture.filter_categoryBits);
                                        fix.filter.groupIndex = parseFloat(arrFixture.filter_groupIndex);
                                        fix.filter.maskBits = parseFloat(arrFixture.filter_maskBits);

                                        var polyshape = new b2PolygonShape;

                                        var polygonArray = polyDef.split(',');

                                        for(var vindex = 0; vindex < polygonArray.length; vindex += 2) {
                                            vertices[vindex/2] = new b2Vec2;
                                            vertices[vindex/2].Set(parseFloat(polygonArray[vindex])/this.ptmRatio,parseFloat(polygonArray[vindex+1])/this.ptmRatio);
                                        }

                                        polyshape.SetAsArray(vertices, vertices.length);
                                        fix.shape = polyshape;

                                        fixDefs.push(fix);

                                    } else {

                                        for(var polygon in arrFixture.polygons.polygon) {
                                            var polyDef = arrFixture.polygons.polygon[polygon];


                                            var fix = new b2FixtureDef;
                                            var vertices = [];

                                            fix.density = parseFloat(arrFixture.density);
                                            fix.friction = parseFloat(arrFixture.friction);
                                            fix.restitution = parseFloat(arrFixture.restitution);
                                            fix.filter.categoryBits = parseFloat(arrFixture.filter_categoryBits);
                                            fix.filter.groupIndex = parseFloat(arrFixture.filter_groupIndex);
                                            fix.filter.maskBits = parseFloat(arrFixture.filter_maskBits);

                                            var polyshape = new b2PolygonShape;

                                            var polygonArray = polyDef.split(',');

                                            for(var vindex = 0; vindex < polygonArray.length; vindex += 2) {
                                                vertices[vindex/2] = new b2Vec2;
                                                vertices[vindex/2].Set(parseFloat(polygonArray[vindex])/this.ptmRatio,parseFloat(polygonArray[vindex+1])/this.ptmRatio);
                                            }

                                            polyshape.SetAsArray(vertices, vertices.length);
                                            fix.shape = polyshape;

                                            fixDefs.push(fix);

                                        }

                                    }

                                } else if(arrFixture.fixture_type == "CIRCLE") {

                                    var circleDef = arrFixture.circle;
                                    var fix = new b2FixtureDef;

                                    fix.density = parseFloat(arrFixture.density);
                                    fix.friction = parseFloat(arrFixture.friction);
                                    fix.restitution = parseFloat(arrFixture.restitution);
                                    fix.filter.categoryBits = parseFloat(arrFixture.filter_categoryBits);
                                    fix.filter.groupIndex = parseFloat(arrFixture.filter_groupIndex);
                                    fix.filter.maskBits = parseFloat(arrFixture.filter_maskBits);

                                    var circleshape = new b2CircleShape;

                                    circleshape.SetRadius(circleDef.r / this.ptmRatio);
                                    circleshape.m_p = new b2Vec2(circleDef.x / this.ptmRatio, circleDef.y / this.ptmRatio);

                                    fix.shape = circleshape;

                                    fixDefs.push(fix);


                                }

                            }

                        }else if(fixDef.fixture_type == "POLYGON") {

                            if(fixDef.polygons.polygon.length === undefined) {
                                polyDef = fixDef.polygons.polygon;

                                var fix = new b2FixtureDef;
                                var vertices = [];

                                fix.density = parseFloat(fixDef.density);
                                fix.friction = parseFloat(fixDef.friction);
                                fix.restitution = parseFloat(fixDef.restitution);
                                fix.filter.categoryBits = parseFloat(fixDef.filter_categoryBits);
                                fix.filter.groupIndex = parseFloat(fixDef.filter_groupIndex);
                                fix.filter.maskBits = parseFloat(fixDef.filter_maskBits);

                                var polyshape = new b2PolygonShape;

                                var polygonArray = polyDef.split(',');

                                for(var vindex = 0; vindex < polygonArray.length; vindex += 2) {
                                    vertices[vindex/2] = new b2Vec2;
                                    vertices[vindex/2].Set(parseFloat(polygonArray[vindex])/this.ptmRatio,parseFloat(polygonArray[vindex+1])/this.ptmRatio);
                                }

                                polyshape.SetAsArray(vertices, vertices.length);
                                fix.shape = polyshape;

                                fixDefs.push(fix);

                            } else {

                                for(var polygon in fixDef.polygons.polygon) {
                                    var polyDef = fixDef.polygons.polygon[polygon];


                                    var fix = new b2FixtureDef;
                                    var vertices = [];

                                    fix.density = parseFloat(fixDef.density);
                                    fix.friction = parseFloat(fixDef.friction);
                                    fix.restitution = parseFloat(fixDef.restitution);
                                    fix.filter.categoryBits = parseFloat(fixDef.filter_categoryBits);
                                    fix.filter.groupIndex = parseFloat(fixDef.filter_groupIndex);
                                    fix.filter.maskBits = parseFloat(fixDef.filter_maskBits);

                                    var polyshape = new b2PolygonShape;

                                    var polygonArray = polyDef.split(',');

                                    for(var vindex = 0; vindex < polygonArray.length; vindex += 2) {
                                        vertices[vindex/2] = new b2Vec2;
                                        vertices[vindex/2].Set(parseFloat(polygonArray[vindex])/this.ptmRatio,parseFloat(polygonArray[vindex+1])/this.ptmRatio);
                                    }

                                    polyshape.SetAsArray(vertices, vertices.length);
                                    fix.shape = polyshape;

                                    fixDefs.push(fix);

                                }

                            }

                        } else if(arrFixture.fixture_type == "CIRCLE") {

                            var circleDef = fixDef.circle;
                            var fix = new b2FixtureDef;

                            fix.density = parseFloat(arrFixture.density);
                            fix.friction = parseFloat(arrFixture.friction);
                            fix.restitution = parseFloat(arrFixture.restitution);
                            fix.filter.categoryBits = parseFloat(arrFixture.filter_categoryBits);
                            fix.filter.groupIndex = parseFloat(arrFixture.filter_groupIndex);
                            fix.filter.maskBits = parseFloat(arrFixture.filter_maskBits);

                            var circleshape = new b2CircleShape;

                            circleshape.SetRadius(circleDef.r / this.ptmRatio);
                            circleshape.m_p = new b2Vec2(circleDef.x / this.ptmRatio, circleDef.y / this.ptmRatio);

                            fix.shape = circleshape;

                            fixDefs.push(fix);

                        }


                }

                entity.fixDefs = fixDefs;

                g_gbservershapecacheinstance.bodies.setObjectForKey(entity, entity.name);

            }

            if (g_gbservershapecacheinstance.start) {
                g_gbservershapecacheinstance.cb();
            }
        },

        setPTM : function(ratio) {
            this.ptm = ratio;
        },

        setResourceDir : function(dir) {
            this.resourceFolder = dir;
            console.log('resource dir set as: ' + this.resourceFolder);
        }
    }
})();