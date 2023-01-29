import { Component } from "@angular/core";
import faker from 'faker';
import { of } from "rxjs";

const getImage = () => {
  const arr = [
    {
      src: "https://i.postimg.cc/tgMnbr02/osb-demo-1280x720.jpg",
      width: 1280,
      height: 720
    },
    {
      src: "https://i.postimg.cc/SR0X2Jx9/osb-demo-1280x990.jpg",
      width: 1280,
      height: 990
    },
  ]

  return arr[~~(Math.random() * arr.length)];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  entries: Array<any> = [];

  constructor() {
    this.create()
  }

  create() {
    for (var i = 1; i <= 12; i++) {
      this.entries.push({
        id: faker.datatype.number(),
        title: faker.lorem.words(5),
        body: faker.lorem.sentences(3),
        image: (i % 5 === 0) ? '' : getImage()
      });
    }
  }

  add() {
    let obj = {
      image: getImage(),
      id: faker.datatype.number(),
      title: faker.lorem.words(5),
      body: faker.lorem.sentences(3),
    };

    this.entries.unshift(obj);
  }

  getEntries() {
    return of(this.entries);
  }

}
