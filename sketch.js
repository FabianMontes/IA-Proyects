let img;
let bubble,endpoints;
let input, checkbox;
let diam;
function setup() {
  createCanvas(600, 600);
  input = createFileInput(handleImage);
  input.position(0,height);

  checkbox = createCheckbox();
  checkbox.position(width-20,height);
  bubble = []
  endpoints = []
  diam = 10;
}

function draw() {
  background(200);
  if (img) {
    image(img, 0, 0, width, height, 0, 0, img.width, img.height, CONTAIN);
  }
  
  for(i=0;i< endpoints.length ;i++){
    if (checkbox.checked()) {
      fill(getColor(i, endpoints.length,50))
    }else{
      noFill()
    }
    beginShape();
    for(j=0;j< endpoints[i].length ;j++){
      vertex(endpoints[i][j][0],endpoints[i][j][1]);
    }
    endShape(CLOSE);
    if (checkbox.checked()) {
      fill(getColor(i, endpoints.length,255))
    }else{
      fill(255)
    }
    circle(bubble[i][0],bubble[i][1],diam)
  }
}

function mousePressed() {
  if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return
  for(i=0;i< bubble.length ;i++){
    if(mouseX > bubble[i][0]-diam &&mouseX < bubble[i][0]+diam){
       if(mouseY > bubble[i][1]-diam &&mouseY < bubble[i][1]+diam){
          bubble.splice(i,1)
         i=i-1
         break;  
      } 
    }
  }
  if(i >=bubble.length){
    bubble.push([mouseX,mouseY])
  } 
  setBorders();
}

function setBorders(){
  borderpoints =[]
  endpoints = []
  for(i=0;i< bubble.length ;i++){
    bubble1 = bubble[i]
    endpoints.push([[0,0],[0,height],[width,height],[width,0]])
    for(j=0;j< bubble.length;j++){
      if(i!=j){
        
        bubble2 = bubble[j]
        m = (bubble2[1]-bubble1[1])/(bubble2[0]-bubble1[0])
        borderpoints.push([[(bubble2[0]+bubble1[0])/2,(bubble2[1]+bubble1[1])/2],-1/m])
        x = (bubble2[0]+bubble1[0])/2
        y = (bubble2[1]+bubble1[1])/2
        m = -1/m
        let b,x1,x2,y1,y2;
        if(abs(m) == Infinity){
          b = y
          y1 = Infinity
          x1 = x
          y2 = Infinity
          x2 = x
        }else{
          b = y -x*m
           y1 = b
          x1 = (0 -b)/m
          y2 = width*m + b
          x2 = (height -b)/m
        }
       
        one = null;
        two = null;
        if(y1>=0 && y1<= height){
          one = [0,parseFloat(y1.toFixed(3))]
          
        }
        if(x1>=0 && x1<= width){
          
          if(one ==null){
            one =[parseFloat(x1.toFixed(3)),0]
          }else{
            two =[parseFloat(x1.toFixed(3)),0]
          }
          try{
            if(one[0] == two[0] && one[1] == two[1]){
              two = null
            }
          }catch(e){
            
          }
        }
        if(y2>=0 && y2<= height){
          if(one ==null){
            one =[width,parseFloat(y2.toFixed(3))]
          }else if(two== null){
            two =[width,parseFloat(y2.toFixed(3))]
          }
          try{
            if(one[0] == two[0] && one[1] == two[1]){
              two = null  
            }
          }catch(e){
            
          }
        }
        if(x2>=0 && x2<= width){
          if(one ==null){
            one =[parseFloat(x2.toFixed(3)),height]
          }else if(two== null){
            two =[parseFloat(x2.toFixed(3)),height]
          }
        }
        ones =null
        ones1 =0
        twos = null
        twos2 = 0
        if(one != null && two != null){
          figure = endpoints[i]
          for(k=0;k< figure.length;k++){
             inter = findIntersection([figure[k],figure[(k+1)%figure.length]],[one,two])
             if(inter!= null){
               if(ones == null){
                  ones = inter 
                  ones1 = k+1
               }else{
                 if(inter[0] != ones[0] || inter[1] != ones[1]){
                   twos = inter
                   twos2 = k
                 
                   break;
                 }               
               }
             }
          }
          if(twos != null){
            parts = partirArray(figure,ones1,twos2)
            tipo = parts[0].length < parts[1].length ? 0 : 1;
            for(k=0;k< parts[tipo].length;k++){
              if(findIntersection([parts[tipo][k],bubble1],[ones,twos])!=null){
                 tipo = (tipo+1)%2
                 break;
              }  
            }
            parts[tipo].splice(tipo ==1?parts[tipo].length:0,0,tipo ==1?ones:twos,tipo ==1?twos:ones)
            endpoints[i] = parts[tipo]
          }
        }
      }  
    }
  }
}

function partirArray(array, inicio, fin) {
    let segmento = array.slice(inicio, fin + 1);
    let restante = array.slice(fin + 1).concat(array.slice(0, inicio));
    return [segmento,restante];
}

function findIntersection(line1, line2) {
  let x1 = line1[0][0];
  let y1 = line1[0][1];
  let x2 = line1[1][0];
  let y2 = line1[1][1];
  
  let x3 = line2[0][0];
  let y3 = line2[0][1];
  let x4 = line2[1][0];
  let y4 = line2[1][1];
  
  let m1 = (x2 - x1) !== 0 ? (y2 - y1) / (x2 - x1) : Infinity;
  let m2 = (x4 - x3) !== 0 ? (y4 - y3) / (x4 - x3) : Infinity;
  //print(x1,y1,x2,y2,x3,y3,x4,y4,m1,m2 , "men")
  let b1, b2, x, y;
  if (m1 === m2) {
    return null;
  }  
  if (m1 === Infinity) {
    x = x1;
    b2 = y3 - m2 * x3;
    y = m2 * x + b2;
    b1 = Infinity
  } else if (m2 === Infinity) {
    
    x = x3;
    b1 = y1 - m1 * x1;
    y = m1 * x + b1;
    b2 = Infinity
  } else {
    
    b1 = y1 - m1 * x1;
    b2 = y3 - m2 * x3;
    x = (b2 - b1) / (m1 - m2);
    y = m1 * x + b1;
  }
  //print(b1,b2,x,y, "meno")
  x = parseFloat(x.toFixed(3))
  y = parseFloat(y.toFixed(3))
  //print(b1,b2,x,y, "menddo")
  
  
  if ((x >= Math.min(x1, x2) && x <= Math.max(x1, x2)) &&
      (x >= Math.min(x3, x4) && x <= Math.max(x3, x4)) &&
      (y >= Math.min(y1, y2) && y <= Math.max(y1, y2)) &&
      (y >= Math.min(y3, y4) && y <= Math.max(y3, y4))) {
    return [x, y]; 
  } else {
    return null; 
  }
}


function handleImage(file) {
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();
  } else {
    img = null;
  }
}

function getColor(index, total,alpha) {
    let hue = (240 * index) / (total - 1);
    let alphaNormalized = alpha / 255;
    let rgbColor = hslToRgb(hue / 360, 1, 0.5);
    return `rgba(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]},${alphaNormalized})`;
}

function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; 
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3) * 255;
        g = hue2rgb(p, q, h) * 255;
        b = hue2rgb(p, q, h - 1 / 3) * 255;
    }
    return [Math.round(r), Math.round(g), Math.round(b)];
}