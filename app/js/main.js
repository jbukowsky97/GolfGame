import * as THREE from 'three';
import Player from './models/player';
import Driver from './models/driver';
import Iron from './models/iron';
import Wedge from './models/wedge';
import { Vector3 } from 'three';
import GolfBall from './models/golfball';
import Tee from './models/tee';
import Putter from './models/putter';
import Course from './models/course';
import Arrow from './models/arrow';

const PLAYER_SPEED = 0.04;
const PLAYER_ROTATION_SPEED = 0.002;
const PLAYER_ROTATION_SPEED_SWING = 0.0005;
const YARD = 1.375;
const GAME_STATE = [
  'PLACE_BALL',
  'LIVE_BALL',
  'READY',
];

export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
    this.totalScoreElement = document.getElementById("total_score");
    this.currentParElement = document.getElementById("current_par");
    this.currentStrokesElement = document.getElementById("current_strokes");
    this.distanceElement = document.getElementById('distance');
    this.windElement = document.getElementById('wind');
    this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
    this.renderer.setSize( window.innerWidth - 20, window.innerHeight - 20 );
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xe2fdff );
    this.camera = new THREE.PerspectiveCamera( 75, (window.innerWidth - 20) / (window.innerHeight - 20), 0.1, 1000 );
    this.camera.position.z = 8;
    this.camera.position.y = 4;

    this.state = 0;

    this.course = new Course();

    this.wind = {
      x: Math.random() * 20 - 10,
      z: Math.random() * 20 - 10,
    };

    this.windElement.innerHTML = `Wind: ${Math.sqrt(Math.pow(this.wind.x, 2) + Math.pow(this.wind.z, 2)).toFixed(2)} mph`

    this.windArrow = new Arrow();
    this.windArrow.position.set(-100, 100, -320);
    if (Math.sign(this.wind.x) === 1) {
      this.windArrow.rotation.z = -Math.PI / 2 + Math.atan(-this.wind.z / this.wind.x);
    } else if (Math.sign(this.wind.z) === -1) {
      this.windArrow.rotation.z = Math.PI / 2 + Math.atan(-this.wind.z / this.wind.x);
    } else {
      this.windArrow.rotation.z = Math.PI / 2 + Math.atan(-this.wind.z / this.wind.x);
    }

    this.driver = new Driver();
    this.iron = new Iron();
    this.wedge = new Wedge();
    this.putter = new Putter();

    this.ball = new GolfBall(this.wind);
    this.ball.setTarget(this.course.getCurrentHole().holeCoords);

    this.tee = new Tee();

    this.player = new Player(this.camera);
    // this.player.position.z = -26.9;
    // this.player.position.set(-150, 0, -600);
    // this.player.rotation.y = Math.PI;
    // this.player.position.set(-425, 0, -160);
    // this.player.rotation.y = -Math.PI / 2;
    this.player.neutralPosture();
    this.player.updateClub(this.driver);

    this.scene.add(this.course);
    this.scene.add(this.windArrow);
    this.scene.add(this.player);

    this.ambientLight = new THREE.AmbientLight( 0x404040 );
    this.scene.add( this.ambientLight );

    this.hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    this.scene.add( this.hemisphereLight );

    this.keys = new Array();
    this.actionUp = true;

    this.playerCoords = new Vector3();

    this.totalScoreElement.innerHTML = 'Total Score: E';
    this.currentPar = this.course.getCurrentHole().getPar();
    this.currentParElement.innerHTML = `Current Par: ${this.currentPar}`;
    this.totalPar = 0;
    this.totalStrokes = 0;
    this.currentStrokes = 0;

    const _self = this;
    document.addEventListener("keydown", onKeyDown, false);
    function onKeyDown(event) {
      const keyCode = event.which;
      if (keyCode === 49 ) {
        if (!_self.player.swinging) {
          _self.player.updateClub(_self.driver);
        }
      } else if (keyCode === 50) {
        if (!_self.player.swinging) {
          _self.player.updateClub(_self.iron);
        }
      } else if (keyCode === 51) {
        if (!_self.player.swinging) {
          _self.player.updateClub(_self.wedge);
        }
      } else if (keyCode === 52) {
        if (!_self.player.swinging) {
          _self.player.updateClub(_self.putter);
        }
      } else if (!_self.keys.includes(keyCode)) {
        _self.keys.push(keyCode);
      }
    };
    document.addEventListener("keyup", onKeyUp, false);
    function onKeyUp(event) {
      const keyCode = event.which;
      if (keyCode === 69) {
        _self.actionUp = true;
      }
      _self.keys = _self.keys.filter(kc => kc != keyCode);
    }

    // window.addEventListener('resize', () => this.resizeHandler());

    // this.resizeHandler();
    requestAnimationFrame(() => this.render());

    this.prevTime = new Date().getTime();
  }

  render() {
    const currentTime = new Date().getTime();
    const delta = currentTime - this.prevTime;
    this.prevTime = currentTime;

    this.player.getWorldPosition(this.playerCoords);
    this.course.getCurrentHole().onGreen(this.playerCoords);

    if (this.ball.inHole) {
      this.ball.inHole = false;
      this.ball.live = false;
      this.scene.remove(this.ball);
      this.course.nextHole();
      this.state = 0;
      this.totalPar += this.currentPar;
      this.totalStrokes += this.currentStrokes;
      this.currentStrokes = 0;
      this.totalScoreElement.innerHTML = `Total Score: ${this.interpretScore(this.totalPar, this.totalStrokes)}`;
      this.currentStrokesElement.innerHTML = `Current Strokes: ${this.currentStrokes}`;
      if (this.course.getCurrentHole() !== undefined) {
        this.ball.setTarget(this.course.getCurrentHole().holeCoords);
        this.currentPar = this.course.getCurrentHole().getPar();
        this.currentParElement.innerHTML = `Current Par: ${this.currentPar}`;
      } else {
        this.currentParElement.innerHTML = '';
        this.currentStrokesElement.innerHTML = '';
        return;
      }
    }

    if (this.keys.includes(87) && !this.keys.includes(83) && this.player.finishedSwing) {
      if (!this.player.walking) {
        this.player.startWalking(true);
      }
      const dx = delta * PLAYER_SPEED * Math.sin(this.player.rotation.y);
      const dz = delta * PLAYER_SPEED * Math.cos(this.player.rotation.y);
      this.player.position.x -= dx;
      this.player.position.z -= dz;
    } else if (this.keys.includes(83) && !this.keys.includes(87) && this.player.finishedSwing) {
      if (!this.player.walking) {
        this.player.startWalking(false);
      }
      const dx = delta * PLAYER_SPEED * Math.sin(this.player.rotation.y);
      const dz = delta * PLAYER_SPEED * Math.cos(this.player.rotation.y);
      this.player.position.x += dx;
      this.player.position.z += dz;
    } else {
      if (this.player.walking) {
        this.player.stopWalking();
      }
    }
    if (this.keys.includes(65)) {
      if (this.player.inGolfPosture) {
        if (!this.player.swinging) {
          this.player.rotation.y += PLAYER_ROTATION_SPEED_SWING * delta;
        }
      } else {
        this.player.rotation.y += PLAYER_ROTATION_SPEED * delta;
      }
    }
    if (this.keys.includes(68)) {
      if (this.player.inGolfPosture) {
        if (!this.player.swinging) {
          this.player.rotation.y -= PLAYER_ROTATION_SPEED_SWING * delta;
        }
      } else {
        this.player.rotation.y -= PLAYER_ROTATION_SPEED * delta;
      }
    }
    if (this.keys.includes(69) && this.actionUp) {
      this.actionUp = false;
      if (GAME_STATE[this.state] === 'PLACE_BALL') {
        if (this.course.getCurrentHole().insideTeeBox(this.playerCoords)) {
          this.state++;
          this.tee.position.set(this.playerCoords.x, 0, this.playerCoords.z);
          this.ball.live = true;
          this.ball.position.set(this.playerCoords.x, this.tee.getTeeHeight(), this.playerCoords.z);
          this.scene.add(this.tee);
          this.scene.add(this.ball);
        }
      } else if (GAME_STATE[this.state] === 'LIVE_BALL') {
        if (this.ball.withinRange(this.playerCoords) && !this.player.swinging && !this.ball.traveling) {
          this.state++;
          const rotationY = this.player.rotation.y + 3 / 2 * Math.PI;

          this.player.stopWalking();
          this.player.golfPosture();
          this.player.rotation.y = rotationY;
          this.player.position.set(this.ball.ballCoords.x, 0, this.ball.ballCoords.z);
        }
      } else if (GAME_STATE[this.state] === 'READY') {
        this.state--;
        this.currentStrokes++;
        this.currentStrokesElement.innerHTML = `Current Strokes: ${this.currentStrokes}`;
        this.player.startSwing(this.ball, this.player.rotation.y);
      }
    }
    if (this.player.backswing && this.actionUp) {
      this.player.startDownswing();
    }
    
    this.player.animate();
    this.ball.update();

    this.course.keepWithin(this.player);
    if (this.ball.live && !this.course.getCurrentHole().withinHole(this.ball.ballCoords)) {
      this.ball.traveling = false;
      this.ball.position.set(this.ball.initialPosition.x, this.ball.initialPosition.y, this.ball.initialPosition.z);
      this.currentStrokes++;
      this.currentStrokesElement.innerHTML = `Current Strokes: ${this.currentStrokes}`;
    }

    if (this.ball.live) {
      this.distanceElement.innerHTML = `Distance: ${(this.ball.distanceTo(this.course.getCurrentHole().holeCoords) / YARD).toFixed(1)} yards`;
    } else if (this.distanceElement.innerHTML !== 'Distance:') {
      this.distanceElement.innerHTML = 'Distance:';
    }

    this.renderer.render( this.scene, this.camera );

    requestAnimationFrame(() => this.render());
  }

  interpretScore(totalPar, totalStrokes) {
    const temp = totalStrokes - totalPar;
    if (temp === 0) {
      return 'E';
    } else if (temp > 0) {
      return `+${temp}`;
    } else {
      return temp;
    }
  }

  // resizeHandler() {
  //   const canvas = document.getElementById("mycanvas");
  //   let w = window.innerWidth - 16;
  //   let h = 0.75 * w;  /* maintain 4:3 ratio */
  //   if (canvas.offsetTop + h > window.innerHeight) {
  //     h = window.innerHeight - canvas.offsetTop - 16;
  //     w = 4/3 * h;
  //   }
  //   canvas.width = w;
  //   canvas.height = h;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(w, h);
  //   this.tracker.handleResize();
  // }
}