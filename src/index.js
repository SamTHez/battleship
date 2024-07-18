import _ from 'lodash';
import Pages from './pages';
import Game from './game';
import './style.css';

const content = document.getElementById("content");
Pages.loadStartPage(content);
Game.changeState("MoveToSetup");
// Game.changeState("MoveToGame");
// Game.changeState("GameEnd");  