
// (function(){
//   'use strict';
//     /**@ngInject*/

//   angular
//     .module('BauVoiceApp')
//     .directive('svgTemplatePoints', svgTemplatePoints);

//   function svgTemplatePoints(DesignStor, ProductStor) {
//   	var pixell = 0.265;
//   	var Kx= (900*0.265);
//   	var Ky= 100;

//   return {
//       restrict: 'E',
//       replace: true,
//       transclude: true,
//       scope: {
//         template: '=',
//       },
//       link: function (scope, elem, attrs) {

//         scope.$watch('template', function () {
//           templatePoints(scope.template);
//         });

//         function templatePoints(template) {
//         	 var container = document.createElement('div'), mainPointsSVG;
// 			if(template && !$.isEmptyObject(template)) {
// 				console.info('2222-', template);
// 				var blockQty = template.details.length,
// 	        	path = '';
// 				if(ProductStor.product.construction_type == 1 || ProductStor.product.construction_type == 3 ) {
// 	        	  while(--blockQty > 0) {
// 	        	   if (template.details[blockQty].level === 1) {
// 	        	  	console.info('333333-', template.details[blockQty].pointsOut);
// 	        	  	var pointsOutQty =  template.details[blockQty].pointsOut.length;
// 	        	  	while(--pointsOutQty > -1) {
// 	        	  		path += (template.details[blockQty].pointsOut[pointsOutQty].x*pixell+Kx);
// 	        	  		if(pointsOutQty == 0) {
// 							path += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y*pixell+Ky);
// 	        	  		} else {
// 							path += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y*pixell+Ky) +',';
// 	        	  		}
						
// 	        	  	}
					
// 				  }
// 	        	}

// 	        	console.info('333333-', path);

// 	        	mainPointsSVG = d3.select(container).append('svg').attr({
// 	              'width': 0,
// 	              'height': 0
// 	            });
// 	            mainPointsSVG.append('defs').append('clipPath')
// 	            .attr('id', 'clipPolygon')
// 	            .append('polygon')
// 	            .attr('points', function() {
// 	            	return path
// 	            } , transform: 'translate(' + position.x + ', ' + position.y + ') scale('+ scale +','+ scale +')'  );

// 	             elem.html(container);
//            }
// 		}


			
//         }
//       }
//     }
//   }
// })();
