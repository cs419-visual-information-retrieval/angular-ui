import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { first } from "rxjs";

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

function b64toBlob(b64Data: string, contentType: string, sliceSize: number = 512) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}


function imageToBlob(base64: string) {
  // Split the base64 string in data and contentType
  let block = base64.split(";");
  // Get the content type of the image
  let contentType = block[0].split(":")[1];// In this case "image/gif"
  // get the real base64 content of the file
  let realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

  // Convert it to a blob to upload
  return b64toBlob(realData, contentType);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  entries: Array<any> = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  status: string = '';
  requestTime: number = 0;

  constructor(private http: HttpClient) {
  }

  fileChangeEvent(event: any): void {
    console.log(event);
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }


  drag() {
    this.status = 'draging drag-box';
  }

  drop() {
    this.status = 'drag-box';
  }

  buildFormData() {
    const formData = new FormData();
    formData.append('file', imageToBlob(this.croppedImage), 'cropped-image.jpeg');
    return formData;
  }

  inMemorySearch() {
    let startFrom = new Date().getTime();
    this.http.post<{
      path: string,
      distance: number
    }[]>('http://127.0.0.1:5000', this.buildFormData(), {})
      .pipe(first())
      .subscribe(res => {
        this.requestTime = new Date().getTime() - startFrom;
        this.entries = res.map(hit => {
          return {
            image: `http://cdn.open.impc.vn/${hit.path}`,
            title: hit.path.split("/").slice(3).join("/"),
            distance: hit.distance
          }
        });

      })

  }

  elasticSearch() {
    let startFrom = new Date().getTime();
    this.http.post<{
      hits: {
        hits: {
          _score: number,
          _source: {
            path: string
          }
        }[],
      }
    }>('http://127.0.0.1:5000?type=es', this.buildFormData(), {})
      .pipe(first())
      .subscribe(res => {
        this.requestTime = new Date().getTime() - startFrom;
        this.entries = res.hits.hits.map(hit => {
          return {
            image: `http://cdn.open.impc.vn/${hit._source.path}`,
            title: hit._source.path.split("/").slice(3).join("/"),
            distance: hit._score
          }
        });
      })

  }

}
