import { Group, MeshPhongMaterial, Mesh, FontLoader, TextBufferGeometry, MeshBasicMaterial, Vector3 } from 'three';

export default class Font extends Group {
  constructor(text, size, height, translate = new Vector3(0, 0, 0)) {
    super();

    const loader = new FontLoader();

    const _self = this;
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
      const fontGeometry = new TextBufferGeometry(text, {
        font: font,
        size: size,
        height: height,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelSegments: 0,
      } );
      fontGeometry.translate(translate.x, translate.y, translate.z);

      const fudge = new MeshBasicMaterial({ color: 0x1a4c1c });
      _self.text = new Mesh(fontGeometry, fudge);
      _self.text.position.y = 0;

      _self.add(_self.text);
    } );
  }
}