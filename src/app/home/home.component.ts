import { Component, OnChanges, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart } from "chart.js"
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: true })
  canvas2: ElementRef<HTMLCanvasElement>;  
  @ViewChild('canvas3', { static: true })
  canvas3: ElementRef<HTMLCanvasElement>;  
  ctx = null
  color = ['red', 'blue', 'green', 'yellow', 'orange', 'black', 'cyan', 'purple', 'pink', 'skyblue', 'tomato', 'springgreen']
  constructor() { }
  circles = []
  question: string
  size = ["big", "small"]
  statistics = {}
  start = null
  elements = [];
  end = null
  trianno = 0;
  restart = false;
  isDivVisible = false
  Linearchart = []
  Linearchart2 = []
  start_dist = null
  end_dist = null;
  stat_dist = []
  current_circle = null
  ngOnInit(): void {
    // this.start_game()
  }

  euclidean(c1,c2)
  {
    return Math.sqrt(Math.pow(c1.x-c2.x,2)+Math.pow(c1.y-c2.y,2));
  }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  
  setup() {

    this.ctx.canvas.addEventListener('click', (event) => {
      var rect = this.canvas.nativeElement.getBoundingClientRect()
      var x = event.x - rect.left;
      var y = event.y - rect.top;
      this.elements.forEach((ele) => {
        if (this.check_a_point(x, y, ele.x, ele.y, ele.r) && ele == this.current_circle) {
          if (this.trianno >=29) {
            this.drawgraph();
          }
          var context = this.canvas.nativeElement.getContext('2d');
          this.clearCanvas(context, this.ctx.canvas);
          if (!this.start) {
            this.start = Date.now()
            this.start_dist = {x:x,y:y}
          }
          else {
            this.end = Date.now()
            this.end_dist = {x:x,y:y}
            if (this.statistics[ele.r]) {
              this.statistics[ele.r].push(this.end - this.start)
              this.stat_dist[ele.r].push(this.euclidean(this.end_dist,this.start_dist))
            }
            else {
              this.statistics[ele.r] = []
              this.stat_dist[ele.r] = []
              this.statistics[ele.r].push(this.end - this.start)
              this.stat_dist[ele.r].push(this.euclidean(this.end_dist,this.start_dist))

            }
          }

          this.elements = []
          this.circles = []
          let NumCircles = 1,
            protection = 10;
           let counter = 0;
          while (this.circles.length < NumCircles && counter < protection) {
            counter++;
            let width = 900
            let height = 400
            let circle = {
              x: this.randomInteger(50, width),
              y: this.randomInteger(50, height),
              r: this.randomInteger(10, 40),
              c: this.randomInteger(0, 10),
            };
            let overlapping = false;
            for (var i = 0; i < this.circles.length; i++) {
              var existing = this.circles[i];

              let intersects = Math.hypot(existing.x - circle.x, existing.y - circle.y) <= (existing.r + circle.r);
              if (intersects || Math.abs(existing.r - circle.r) <= 1) {
                overlapping = true;
                break;
              }
            }

            if (!overlapping) {
              this.circles.push(circle);
            }

          }
          this.circles.forEach(data => {
            this.elements.push(data);
          })
          this.trianno += 1;
          this.setup()
        }
      });

    }, false);

    this.elements.forEach((ele) => {
      this.draw(ele.x, ele.y, ele.r, ele.c);
    })
    this.current_circle = this.circles[0]
  }


  draw(x: number, y: number, z: number, c: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, z, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color[c];
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();

  }

  check_a_point(a, b, x, y, r) {
    var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
    r *= r;
    if (dist_points <= r) {
      return true;
    }
    return false;
  }

  isIntersect(point, circle) {
    return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
  }




  clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  drawgraph() {
    console.log(this.statistics)
    let avg = {}
    let avg_dist = {}
    let x = []
    let y = []
    let data = []
    for (var key of Object.keys(this.statistics)) {
      let sum = 0
      for (let j = 0; j < this.statistics[key].length; j++) {
        sum += this.statistics[key][j]
      }
      sum = sum / this.statistics[key].length
      avg[key] = sum
      x.push(key)
      y.push(avg[key])
      data.push({x:key,y:sum})

    }


    let data2 = []
    let x2 = []
    let y2 = []
    for (var key of Object.keys(this.stat_dist)) {
      let sum2 = 0
      for (let j = 0; j < this.stat_dist[key].length; j++) {
        sum2 += this.stat_dist[key][j]
      }
      sum2 = sum2 / this.stat_dist[key].length
      avg_dist[key] = sum2
      data2.push({x:avg_dist[key],y:avg[key]})
    }
    let distancedata = data2.sort((a, b) => b.x - a.x);
    
    for(let i = 0;i<distancedata.length;i++)
    {
      x2.push(parseInt(distancedata[i].x))
      y2.push((distancedata[i].y))
    }

    let x3 = []
    let y3 = []
    let a = y2[0]-1;
    let b = y2[0]-3;

    for(let i = 0;i<y2.length;i++)
    {
      x3.push(Math.log2(2*y2[i])/x2[i])
      y3.push(a+b*(Math.log2(2*y2[i])/x2[i]))
    }
    
    console.log(x3,y3)

    var ctx = this.canvas.nativeElement.getContext('2d')

    this.Linearchart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: x,
        datasets: [
          {
            data: y,
            borderColor: '#3cb371',
            backgroundColor: "gray",
            fill:false,
            label: 'Radius Vs Time',

          }
        ]
      },
      options: {
        legend: {
          display: true,
          text: 'Radius vs Time'
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Radius'
            },
          },
        ],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time'
            },
          }],
        }
      }
    });
    this.restart = true
    var ctx2 = this.canvas2.nativeElement.getContext('2d')

    this.Linearchart2 = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: x2,
        datasets: [
          {
            data: y2,
            borderColor: 'red',
            backgroundColor: "gray",
            fill:false,
            label: 'Distance Vs Time',

          }
        ]
      },
      options: {
        plugins: {
          legend: {
              display: true,
              labels: {
                  color: 'rgb(255, 99, 132)',
                  title:{
                    display:true,
                    text:"ajhagu"
                  }
              }
          }
      },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Distance'
            },
          },
        ],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time'
            },
          }],
        }
      }
    });


    var ctx3 = this.canvas3.nativeElement.getContext('2d')

    this.Linearchart2 = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: x3,
        datasets: [
          {
            data: y3,
            borderColor: 'blue',
            backgroundColor: "gray",
            fill:false,
            label: 'ID Vs MT',

          }
        ]
      },
      options: {
        plugins: {
          legend: {
              display: true,
              labels: {
                  color: 'rgb(255, 99, 132)',
                  title:{
                    display:true,
                    text:"ajhagu"
                  }
              }
          }
      },
        scales: {
          xAxes: [{
            display: false,
            scaleLabel: {
              display: true,
              labelString: 'ID'
            },
          },
        ],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'MT'
            },
          }],
        }
      }
    });

  }



  start_game() {
    this.isDivVisible = true;
    let NumCircles = 1,
      protection = 10;
        let counter = 0
    while (this.circles.length < NumCircles && counter < protection) {
      counter++;
      let width = 900
      let height = 400
      let circle = {
        x: this.randomInteger(50, width),
        y: this.randomInteger(50, height),
        r: this.randomInteger(10, 40),
        c: this.randomInteger(0, 10),
      };
      let overlapping = false;
      for (var i = 0; i < this.circles.length; i++) {
        var existing = this.circles[i];

        let intersects = Math.hypot(existing.x - circle.x, existing.y - circle.y) <= (existing.r + circle.r);
        if (intersects || Math.abs(existing.r - circle.r) <= 1) {
          overlapping = true;
          break;
        }
      }

      if (!overlapping) {
        this.circles.push(circle);
      }

    }


    this.circles.forEach(data => {
      this.elements.push(data);
    })
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.setup()

  }

  restart_()
  {
    window.location.reload()
  }

}