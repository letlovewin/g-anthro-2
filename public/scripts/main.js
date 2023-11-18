let cur_chart = null;

//chart title is x_axis.options[x_axis.selectedIndex].text + " versus " + y_axis.options[y_axis.selectedIndex].text

let plotData = async function(g){
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
    for(let i=0;i<1986;i++){
        points.push({x: parseFloat(data[i][x_axis.options[x_axis.selectedIndex].text]),y:parseFloat(data[i][y_axis.options[y_axis.selectedIndex].text])});
    }
    let user_point = [{x:parseFloat(document.getElementById("user-x-value").value),y:parseFloat(document.getElementById("user-y-value").value)}]
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
            plugins: {
                title: {
                    display: true,
                    text: 'Custom Chart Title'
                }
            }
        }
        }
      );
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