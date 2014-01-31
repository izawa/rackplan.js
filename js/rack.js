/*global $:false, jQuery:false */
/*
 Copyright Notice:

     Copyright (c) 2013 Yukimitsu Izawa <izawa@izawa.org>
     All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions
  are met:
  1. Redistributions of source code must retain the above copyright
     notice, this list of conditions and the following disclaimer.
  2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.
  3. All advertising materials mentioning features or use of this software
     must display the following acknowledgement:
       This product includes software developed by Yukimitsu Izawa.
  4. The name of Yukimitsu Izawa may not be used to endorse or promote products
     derived from this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/
(function (window) {
    function Rackplan (target, srcxml, cssclass) {
        var racks = [];
	var racks_config = [];
        var nets = [];
        var xofs = 50;
        var yofs = 5;

        $(function(){
            $.ajax({
                url: srcxml,
                type: "GET",
                dataType: "xml",
                timeout: 1000,
                success: xml_suc,
                error: xml_err
            });
        });

        function xml_suc (xml) {
            // parse XML
            //
            //  racks[rack_name][offset] = {size: size,
	    //                              color: color, (optional)
	    //                              label: label,  (optional)
            //                              label_color: label_color  (optional)}
            //  racks_config[rackname] = {size: size
            //                            name_color: color (optional)}
            //  nets[rack_name]["left"|"right"][line]  = {color: color,  (optional)
	    //                                            label: label,  (optional)
            //                                  member: [member]}
            //
            for(var i=0; i <=$(xml).find("rack").length - 1; i++) {
                var rack_name = $(xml).find("rack").eq(i).attr("name");
                racks[rack_name] = [];
		racks_config[rack_name] = {
		    "size":$(xml).find("rack").eq(i).attr("size"),
		    "name_color":$(xml).find("rack").eq(i).attr("name_color")
		    };
                nets[rack_name] = {"left":[] ,"right":[]};
                for(var j=0; j <= $(xml).find("rack").eq(i).find("mount").length-1; j++) {
                    racks[rack_name][$(xml).find("rack").eq(i).find("mount").eq(j).attr("offset")]
                        = {"size":
                           $(xml).find("rack").eq(i).find("mount").eq(j).attr("size"),
                           "color":
                           $(xml).find("rack").eq(i).find("mount").eq(j).attr("color"),
                           "label":
                           $(xml).find("rack").eq(i).find("mount").eq(j).attr("label"),
                           "label_color":
                           $(xml).find("rack").eq(i).find("mount").eq(j).attr("label_color")
                          };
                }
                for(j=0; j <=  $(xml).find("rack").eq(i).find("net").length-1; j++) {
                    nets[rack_name][$(xml).find("rack").eq(i).find("net").eq(j).attr("side")][
                        nets[rack_name][$(xml).find("rack").eq(i).find("net").eq(j).attr("side")].length
                    ]
                        ={ "member":
                               mysplit($(xml).find("rack").eq(i).find("net").eq(j).attr("member")),
                           "color": $(xml).find("rack").eq(i).find("net").eq(j).attr("color"),
                           "label": $(xml).find("rack").eq(i).find("net").eq(j).attr("label")
                         };
                }
            }
            draw();
        }

        function xml_err () {
            alert("XMLデータのロードに失敗しました");
        }

        function add_box (canvas, offset, size, label, color, label_color) {
            var position = offset * 23;
            var usize = size * 19 + (size - 1) * 4;
            var ypos = position + 2;

            canvas.drawRect ({
                fillStyle: mydefined(color) ? color : "#eff",
                strokeStyle: "#aaa",
                x: xofs+2, y: yofs+ypos,
                fromCenter: false,
                width: 296,
                height: usize
            });
    
            canvas.drawText ({
                fillStyle: mydefined(label_color) ? label_color : "#9cf",
                x: xofs+150, y: yofs+ypos + usize / 2,
                fontSize: 14,
                fontFamily: "Verdana, sans-serif",
                text: label
            });
        }

        function draw_frame (canvas, size) {
	    var rackheight = size * 19 + size * 4;
            canvas.drawLine ({
                strokeStyle: "#aaa",
                strokeWidth: 1,
                x1: xofs+0, y1: yofs+0,
                x2: xofs+0, y2: yofs + rackheight,
                x3: xofs+300, y3: yofs + rackheight,
                x4: xofs+300, y4: yofs+0,
                closed: true
            });
        }

        function draw_tick (canvas, size) {
            for(var i=1; i < size; i++){
                var ypos = i * 23;
                canvas.drawLine({
                    strokeStyle: "#aaa",
                    strokeWidth: 1,
                    x1: xofs+0, y1: yofs+ypos,
                    x2: xofs+5, y2: yofs+ypos
                });

                canvas.drawLine({
                    strokeStyle: "#aaa",
                    strokeWidth: 1,
                    x1: xofs+295, y1: yofs+ypos,
                    x2: xofs+300, y2: yofs+ypos
                });
            }
        }

        function draw_net (canvas, name) {
            for(var i=0; i < nets[name]["left"].length; i++ ) {
                for(var j=0; j < nets[name]["left"][i]["member"].length; j++ ) {
                    var position = (racks_config[name]["size"] - nets[name]["left"][i]["member"][j] - 1) * 23;
                    var ypos = position + 10;
                    canvas.drawLine({
                        strokeStyle: mydefined(nets[name]["left"][i]["color"]) ? nets[name]["left"][i]["color"] : "black" ,
                        strokeWidth: 1,
                        x1: xofs + 0, y1: yofs+ypos,
                        x2: xofs - 10 * (i+1) , y2: yofs+ypos
                    });
                }

                canvas.drawLine({
                    strokeStyle: mydefined(nets[name]["left"][i]["color"]) ? nets[name]["left"][i]["color"] : "black",
                    strokeWidth: 1,
                    x1: xofs - 10 * (i+1),
                    y1: yofs + (racks_config[name]["size"] - nets[name]["left"][i]["member"][0] -1) * 23 + 10,
                    x2: xofs - 10 * (i+1),
                    y2: yofs + (racks_config[name]["size"] - nets[name]["left"][i]["member"][nets[name]["left"][i]["member"].length-1] -1 ) * 23 + 10
                });

                canvas.rotateCanvas({
                    rotate: -90,
                    x: xofs - 10 * (i+1) -2, 
                    y: ((yofs + (racks_config[name]["size"] - nets[name]["left"][i]["member"][0] -1) * 23 + 10) + (yofs +(racks_config[name]["size"] - nets[name]["left"][i]["member"][nets[name]["left"][i]["member"].length-1] -1 ) * 23 + 10)) / 2
                })
                    .drawText({
                        fillStyle: "#000",
                        strokeWidth: 1,
                        x: xofs - 10 * (i+1), 
                        y: ((yofs + (racks_config[name]["size"] - nets[name]["left"][i]["member"][0] -1) * 23 + 10) + (yofs +(racks_config[name]["size"] - nets[name]["left"][i]["member"][nets[name]["left"][i]["member"].length-1] -1 ) * 23 + 10)) / 2,
                        fontSize: 11,
                        fontFamily: "Verdana, sans-serif",
                        text: nets[name]["left"][i]["label"]
                    })
                    .restoreCanvas();

            }

            for(i=0; i < nets[name]["right"].length; i++ ) {
                for(j=0; j < nets[name]["right"][i]["member"].length; j++ ) {
                    position = (racks_config[name]["size"] - nets[name]["right"][i]["member"][j] - 1) * 23;
                    ypos = position + 10;
                    canvas.drawLine({
                        strokeStyle: mydefined(nets[name]["right"][i]["color"]) ? nets[name]["right"][i]["color"] : "black",
                        strokeWidth: 1,
                        x1: xofs + 300, y1: yofs+ypos,
                        x2: xofs + 300 + 10 * (i+1) , y2: yofs+ypos
                    });
                }

                canvas.drawLine({
                    strokeStyle: mydefined(nets[name]["right"][i]["color"]) ? nets[name]["right"][i]["color"] : "black",
                    strokeWidth: 1,
                    x1: xofs +300 + 10 * (i+1),
                    y1: yofs + (racks_config[name]["size"] - nets[name]["right"][i]["member"][0] -1) * 23 + 10,
                    x2: xofs +300 + 10 * (i+1),
                    y2: yofs + (racks_config[name]["size"] - nets[name]["right"][i]["member"][nets[name]["right"][i]["member"].length-1] -1 ) * 23 + 10
                });

                canvas.rotateCanvas({
                    rotate: 90,
                    x: xofs +300 + 10 * (i+1) +2, 
                    y: ((yofs + (racks_config[name]["size"] - nets[name]["right"][i]["member"][0] -1) * 23 + 10) + (yofs +(racks_config[name]["size"] - nets[name]["right"][i]["member"][nets[name]["right"][i]["member"].length-1] -1 ) * 23 + 10)) / 2
                })
                    .drawText({
                        fillStyle: "#000",
                        strokeWidth: 1,
                        x: xofs +300+ 10 * (i+1), 
                        y: ((yofs + (racks_config[name]["size"] - nets[name]["right"][i]["member"][0] -1) * 23 + 10) + (yofs +(racks_config[name]["size"] - nets[name]["right"][i]["member"][nets[name]["right"][i]["member"].length-1] -1 ) * 23 + 10)) / 2,
                        fontSize: 11,
                        fontFamily: "Verdana, sans-serif",
                        text: nets[name]["right"][i]["label"]
                    })
                    .restoreCanvas();
            }
        }

        function mysplit(string) {
            var re =  /\s*,\s*/;
            return (string.split(re).map(function(a){return(parseInt(a));}).sort(function(a,b){
                if ( a < b ) return -1;
                if ( a > b ) return 1;
                return 0;
            }));
        }

        function mydefined(a) {
            if (typeof a === "undefined") {
                return false;
            }
            else {
                return true;
            }
        }

        function draw() {
            for(var i in racks) {
                var newDiv = $('<div/>', {"class": mydefined(cssclass) ? cssclass : 'col-md-5 col-sm-8'});
                newDiv.append($('<h1>').text(i).css("color", mydefined(racks_config[i]["name_color"]) ? racks_config[i]["name_color"] : "#000"));
		var rackheight = racks_config[i]["size"] * 19 + racks_config[i]["size"] * 4 + 10;
                var newCanvas = 
                        $('<canvas width="400" height="' + rackheight + '"/>').width(400).height(rackheight);
                draw_tick(newCanvas, racks_config[i]["size"]);
                draw_frame(newCanvas, racks_config[i]["size"]);
                draw_net(newCanvas, i);
        
                for(var j = 0; j < racks_config[i]["size"]; j++) {
                    if(racks[i][j]) {
                        add_box(newCanvas,
				racks_config[i]["size"] - j - racks[i][j]["size"] ,
				racks[i][j]["size"], racks[i][j]["label"], racks[i][j]["color"], racks[i][j]["label_color"]);
                    }
                } 
                newDiv.append(newCanvas);
                $(target).append(newDiv);
            }
        }
    }

    window.Rackplan = Rackplan;

} (window));
