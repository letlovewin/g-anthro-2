let cur_chart = null;
let global_race_constraint = 9
document.getElementById("radioBlack").addEventListener("change",function(e){
  e.preventDefault();
  global_race_constraint = 2;
})
document.getElementById("radioWhite").addEventListener("change",function(e){
  e.preventDefault();
  global_race_constraint = 1;
})
document.getElementById("radioHispanic").addEventListener("change",function(e){
  e.preventDefault();
  global_race_constraint = 3;
})
document.getElementById("radioAsian").addEventListener("change",function(e){
  e.preventDefault();
  global_race_constraint = 4;
})
document.getElementById("radioNative").addEventListener("change",function(e){
  e.preventDefault();
  global_race_constraint = 5;
})
document.getElementById("radioPacific").addEventListener("change",function(e){
  e.preventDefault();
  global_race_constraint = 6;
})
document.getElementById("radioOtherRace").addEventListener("change",function(e){
  e.preventDefault();
  global_race_constraint = 8;
})
document.getElementById("radioAll").addEventListener("change",function(e){
  e.preventDefault();
  global_race_constraint = 9;
})
//chart title is x_axis.options[x_axis.selectedIndex].text + " versus " + y_axis.options[y_axis.selectedIndex].text

let plotData = async function(g,r){
  document.getElementById("mainplotdesc").innerHTML=''
    let data = null;
    if (g=="f") {
      data = await d3.csv('scripts/data/femaledata.csv')
    } else if(g=="m") {
      data = await d3.csv('scripts/data/maledata.csv')
    }
    if (cur_chart!=null){
      cur_chart.destroy();
    }
    let points = []
    let x_axis = document.getElementById("x-axis-select");
    let y_axis = document.getElementById("y-axis-select");
    let user_point = [{x:parseFloat(document.getElementById("user-x-value").value),y:parseFloat(document.getElementById("user-y-value").value)}]
    let user_x_percentile = 0;
    let user_y_percentile = 0;
    let n = data.length
    let n2 = 0;
    for(let i=0;i<n;i++){ //generate data points from selected axes
      let b={x: parseFloat(data[i][x_axis.options[x_axis.selectedIndex].text]),y:parseFloat(data[i][y_axis.options[y_axis.selectedIndex].text])};
      if(global_race_constraint!=9&&data[i].Race==global_race_constraint){
        points.push(b);
        if (document.getElementById("user-x-value").value!=0&&document.getElementById("user-y-value").value!=0){
          if(b.x<user_point[0].x){
            user_x_percentile++;
          }
          if(b.y<user_point[0].y){
            user_y_percentile++;
          }
        }
      } else if(global_race_constraint==9){
        points.push(b);
        if (document.getElementById("user-x-value").value!=0&&document.getElementById("user-y-value").value!=0){
          if(b.x<user_point[0].x){
            user_x_percentile++;
          }
          if(b.y<user_point[0].y){
            user_y_percentile++;
          }
        }
      }
      
    }
    let point_color = ''
    let point_label = ''
    if(g=="m"){
      point_color='rgb(117, 162, 240)'
      point_label="Male"
    } else {
      point_color='rgb(255, 99, 132)'
      point_label="Female"
    }
    cur_chart = new Chart(
        document.getElementById('myChart'),
        {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: point_label,
                data: points,
                backgroundColor: point_color
              },
              {
                label: "You",
                data: user_point,
                backgroundColor: 'rgb(0, 255, 34)'
              }
            ]
          },
          options: {
            scales: {
              xAxes: [{
                type: "linear",
                gridLines: {
                  display: true ,
                  color: "#dedede"
                },
              }],
              yAxes: [{
                type: "linear",
                gridLines: {
                  display: true,
                  color: "#dedede"
                },
              }]
            },
        }
        }
      );
      if(user_point[0].x!=NaN){
        user_x_percentile = Math.trunc((user_x_percentile/points.length)*100);
        user_y_percentile = Math.trunc((user_y_percentile/points.length)*100);
        let x_perc = document.createTextNode(user_x_percentile + "th percentile in " + x_axis.options[x_axis.selectedIndex].text)
        let br = document.createElement("br");
        let y_perc = document.createTextNode(user_y_percentile + "th percentile in " + y_axis.options[y_axis.selectedIndex].text + '\n')
        document.getElementById("mainplotdesc").appendChild(x_perc);
        document.getElementById("mainplotdesc").appendChild(br)
        document.getElementById("mainplotdesc").appendChild(y_perc);
      }
}

document.getElementById("btn-plot").addEventListener("click",function(e){
    e.preventDefault();
    let y = document.getElementById("y-axis-select").options[document.getElementById("y-axis-select").selectedIndex].text
    let x = document.getElementById("x-axis-select").options[document.getElementById("x-axis-select").selectedIndex].text
    if(y=="Select..."){
        document.getElementById("error-message").innerHTML = "Please insert a proper measurement for your Y axis.";
        return
    } else if(x=="Select..."){
        document.getElementById("error-message").innerHTML = "Please insert a proper measurement for your X axis.";
        return
    } else if(x==y && y=="Select..."){
      document.getElementById("error-message").innerHTML = "Please insert a proper measurement for your X and Y axes.";
      return
    }
    document.getElementById("error-message").innerHTML="";
    let g = document.querySelector('input[name="radioGender"]:checked').id;
    if (g=="radioMale") {
      plotData("m")
    } else if(g=="radioFemale") {
      plotData("f")
    } else {
      plotData("b")
    }
    
})