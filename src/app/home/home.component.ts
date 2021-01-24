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
  @ViewChild('can') can: ElementRef;
  ctx = null
  color = ['red', 'blue', 'green', 'yellow', 'orange', 'black', 'cyan', 'purple', 'violet', 'darkgreen', 'tomato', 'teal']
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
  ngOnInit(): void {
    // this.start_game()
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
        if (this.check_a_point(x, y, ele.x, ele.y, ele.r)) {

          if (this.trianno >=49) {
            this.drawgraph();
          }
          var context = this.canvas.nativeElement.getContext('2d');
          this.clearCanvas(context, this.ctx.canvas);
          if (!this.start) {
            this.start = Date.now()
          }
          else {
            this.end = Date.now()
            if (this.statistics[ele.r]) {
              this.statistics[ele.r].push(this.end - this.start)
            }
            else {
              this.statistics[ele.r] = []
              this.statistics[ele.r].push(this.end - this.start)
            }
          }

          this.elements = []
          this.circles = []
          let NumCircles = 30,
            protection = 100000,
            counter = 0
          while (this.circles.length < NumCircles && counter < protection) {
            counter++;
            let width = 950
            let height = 400
            let circle = {
              x: this.randomInteger(50, width),
              y: this.randomInteger(50, height),
              r: this.randomInteger(5, 40),
              c: this.randomInteger(0, 10),
            };
            let overlapping = false;
            for (var i = 0; i < this.circles.length; i++) {
              var existing = this.circles[i];

              let intersects = Math.hypot(existing.x - circle.x, existing.y - circle.y) <= (existing.r + circle.r);
              if (intersects || Math.abs(existing.r - circle.r) <= 3) {
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


    let num = this.circles[this.randomInteger(0, this.circles.length - 1)].c
    let size_num = this.randomInteger(0, 1)
    this.question = `Select the ${this.size[size_num]} circle`

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
    console.log(avg)

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
            fill:false
          }
        ]
      },
      options: {
        legend: {
          display: false,
          labelString: 'Radius vs Time'
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
  }



  start_game() {
    this.isDivVisible = true;
    let NumCircles = 30,
      protection = 100000,
      counter = 0
    while (this.circles.length < NumCircles && counter < protection) {
      counter++;
      let width = 900
      let height = 400
      let circle = {
        x: this.randomInteger(60, width),
        y: this.randomInteger(60, height),
        r: this.randomInteger(8, 40),
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
    this.start = Date.now();
    this.setup()

  }

  restart_()
  {
    window.location.reload()
  }

}