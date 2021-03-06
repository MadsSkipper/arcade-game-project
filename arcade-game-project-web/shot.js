﻿<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-us" lang="en-us">
<head>
  <title>Superluminal</title>
  <script type="text/javascript">
var timercount = 0;
var shipx = 240;
var shipy = 600;
var shipwidth = 4;
var shipheight = 6;
var vectorx = 0;
var vectory = 0;
var is_key_left = 0;
var is_key_right = 0;
var is_key_up = 0;
var is_key_down = 0;
var is_firing = 0;
var enemy_freq = 45;
var enemy_count = -100;
var starx = new Array;
var stary = new Array;
var starspeed = new Array;
var bulletx = new Array;
var bullety = new Array;
var bullet_deltax = new Array;
var bullet_deltay = new Array;
var bullet_type = new Array;
var badx = new Array;
var bady = new Array;
var bad_type = new Array;
var bad_deltax = new Array;
var bad_deltay = new Array;
var bad_width = new Array;
var bad_hp = new Array;
var cyclestep = 0;
var game_over = 0;
var is_boss = 0;
var msec_frame = 33;

var is_paused = 0;
var current_wave = 1;
var current_score = 0;
var high_score = 0;
var wave_count = 0;

var power_level = 0;
var shields = 0;

function init() {
    for (var i = 1; i < 100; i++) {
        starx.push (Math.floor (Math.random() * 480));
        stary.push (Math.floor (Math.random() * 640));
        starspeed.push (Math.floor (Math.random() * 5) + 1);
    }
    timed_count();
}

function restart_game() {
    current_score = 0;
    current_wave = 1;
    wave_count = 0;
    is_boss = 0;
    shipx = 240;
    shipy = 600;
    is_firing = is_key_left = is_key_right = is_key_up = is_key_down = 0;
    enemy_count = -100;
    badx.splice (0, badx.length);
    bady.splice (0, bady.length);
    bad_type.splice (0, bad_type.length);
    bad_deltax.splice (0, bad_deltax.length);
    bad_deltay.splice (0, bad_deltay.length);
    bad_width.splice (0, bad_width.length);
    bad_hp.splice (0, bad_hp.length);
    game_over = 0;
    power_level = 0;
    shields = 0;
}

function starfield (ctx) {
    var stardistance;
    for (var i = 0; i < starx.length; i++) {
        stardistance = starspeed[i] * 51;
        if (stardistance < 100) stardistance = 100;
        if (current_wave >= 10) ctx.fillStyle = "rgb(160,0,0)";
        else ctx.fillStyle = "rgb(" + stardistance + "," + stardistance + "," + stardistance + ")";
        ctx.fillRect (starx[i], stary[i], 1, 1);
        stary[i] += starspeed[i];
        if (stary[i] > 639) {
            stary[i] -= 640;
            starx[i] = Math.floor (Math.random() * 480);
            starspeed[i] = Math.floor (Math.random() * 5) + 1;
        }
    }
}

function bullets (ctx) {
    var dead_bullets = new Array;
    for (var i = 0; i < bulletx.length; i++) {
        if (bullet_type[i] == 1) {
            ctx.fillStyle = "rgb(0,128,255)";
            ctx.fillRect (bulletx[i], bullety[i], 2, 12);
        }
        else if (bullet_type[i] == 2) {
            ctx.fillStyle = "rgb(64,192,255)";
            ctx.fillRect (bulletx[i], bullety[i], 2, 24);
        }
        if (bullety[i] < -12) dead_bullets.push (i);
        else {
            for (var e = 0; e < badx.length; e++) {
                if (bad_type[e] > 0 && bad_type[e] != 5) {
                    if (bullety[i] <= bady[e] + 14 && bullety[i] >= bady[e] - 16 &&
                        bulletx[i] <= badx[e] + bad_width[e] && bulletx[i] > badx[e] - bad_width[e]) {
                        current_score++;
                        if (current_score > high_score) high_score = current_score;
                        bad_hp[e]--;
                        if (bad_hp[e] < 1) bad_type[e] = -1;
                        dead_bullets.push (i);
                        if (bad_type[e] == 2) {
                            bad_deltay[e] -= 8;
                            if (bad_deltay[e] < -15) bad_deltay[e] = -15;
                        }
                    }
                }
            }
        }
        bullety[i] += bullet_deltay[i];
        bulletx[i] += bullet_deltax[i];
    }
    for (var i = dead_bullets.length - 1; i >= 0; i--) {
        bulletx.splice (dead_bullets[i], 1);
        bullety.splice (dead_bullets[i], 1);
        bullet_deltax.splice (dead_bullets[i], 1);
        bullet_deltay.splice (dead_bullets[i], 1);
        bullet_type.splice (dead_bullets[i], 1);
    }
}

function drawship (ctx) {
    // Wings
    if (shields == 1 && cyclestep % 2 == 0) {
        ctx.fillStyle = "rgb(0,192,0)";
        ctx.beginPath();
        ctx.moveTo (shipx - 15 - 3, shipy + 18 + 3);
        ctx.lineTo (shipx - 4, shipy - 12 - 3);
        ctx.lineTo (shipx, shipy + 6 + 3);
        ctx.moveTo (shipx + 15 + 3, shipy + 18 + 3);
        ctx.lineTo (shipx + 4, shipy - 12 - 3);
        ctx.lineTo (shipx, shipy + 6 + 3);
        ctx.fill();
    }
    ctx.fillStyle = "rgb(200,200,200)";
    ctx.beginPath();
    ctx.moveTo (shipx - 15, shipy + 18);
    ctx.lineTo (shipx - 4, shipy - 12);
    ctx.lineTo (shipx, shipy + 6);
    ctx.moveTo (shipx + 15, shipy + 18);
    ctx.lineTo (shipx + 4, shipy - 12);
    ctx.lineTo (shipx, shipy + 6);
    ctx.fill();
  
    // Body
    if (shields > 0 && cyclestep % 2 == 0) {
        ctx.fillStyle = "rgb(0,192,0)";
        ctx.fillRect (shipx -4, shipy - 12 - 3, 8, 3);
    }
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect (shipx - 4, shipy - 12, 8, 23);

    // Jet flame (only when in motion, flickers randomly)
    if ((vectorx || vectory) && cyclestep % 2 == 1) {
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.beginPath();
        ctx.moveTo (shipx - 3, shipy + 11);
        ctx.lineTo (shipx + 3, shipy + 11);
        ctx.lineTo (shipx + 5, shipy + 20);
        ctx.lineTo (shipx, shipy + 25 + cyclestep);
        ctx.lineTo (shipx - 5, shipy + 20);
        ctx.fill();
        ctx.fillStyle = "rgb(255,255,0)";
        ctx.beginPath();
        ctx.moveTo (shipx - 2, shipy + 11);
        ctx.lineTo (shipx + 2, shipy + 11);
        ctx.lineTo (shipx + 3, shipy + 15);
        ctx.lineTo (shipx, shipy + 19 + cyclestep / 2);
        ctx.lineTo (shipx - 3, shipy + 15);
        ctx.fill();
    }
  
    // Guns
    ctx.fillStyle = "rgb(128,128,128)";
    ctx.fillRect (shipx - 11, shipy - 10, 2, 20);
    ctx.fillRect (shipx + 9, shipy - 10, 2, 20);
    if (is_firing == 1 && cyclestep % 2 == 0) {
        ctx.fillStyle = "rgb(255,255,128)";
        ctx.fillRect (shipx - 11, shipy - 10, 2, 4);
        ctx.fillRect (shipx + 9, shipy - 10, 2, 4);
        ctx.fillStyle = "rgb(200,200,128)";
        ctx.fillRect (shipx - 11, shipy - 6, 2, 6);
        ctx.fillRect (shipx + 9, shipy - 6, 2, 6);
    }
  
    if (power_level > 0) {
        // Moar guns
        ctx.fillStyle = "rgb(192,192,192)";
        ctx.fillRect (shipx - 18, shipy + 5, 2, 14);
        ctx.fillRect (shipx + 16, shipy + 5, 2, 14);
        ctx.fillRect (shipx - 18, shipy + 10, 5, 9);
        ctx.fillRect (shipx + 12, shipy + 10, 5, 9);
        if (power_level > 500) {
            // At this point, there is more gun than ship
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect (shipx -2, shipy - 22, 4, 17);
        }
    }

    // Cockpit - This is also a graphical representation of the hitbox
    if (shields == 1 && cyclestep % 2 == 0) ctx.fillStyle = "rgb(0,192,0)";
    else ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect (shipx - shipwidth, shipy - shipheight, shipwidth * 2, shipheight * 2);
}

function baddies (ctx) {
    var dead_baddies = new Array;
    for (var i = 0; i < badx.length; i++) {
        if (bad_type[i] < 0) {
            // Explosion
            ctx.beginPath();
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.arc(badx[i], bady[i], bad_type[i] * -4, 0, Math.PI * 2, true);
            ctx.fill();
        }
        else if (bad_type[i] == 0) {
            // Bullet
            if (current_wave >= 7) ctx.fillStyle = "rgb(160,0,0)";
            else ctx.fillStyle = "rgb(255,0,0)";
            ctx.fillRect (badx[i] - 1, bady[i] - 1, 3, 3);
        }
        else if (bad_type[i] == 1) {
            // Death Triangle
            ctx.fillStyle = "rgb(255,255,0)";
            ctx.beginPath();
            ctx.moveTo (badx[i] - 5, bady[i] - 4);
            ctx.lineTo (badx[i] + 5, bady[i] - 4);
            ctx.lineTo (badx[i], bady[i] + 3);
            ctx.fill();
        }
        else if (bad_type[i] == 2) {
            // Rectangle of DOOM
            ctx.fillStyle = "rgb(255,0,255)";
            ctx.fillRect (badx[i] - bad_width[i], bady[i] - 6, bad_width[i] * 2, 6);
            ctx.fillRect (badx[i] - 3, bady[i], 6, 3);
        }
        else if (bad_type[i] == 3) {
            // Heat-seeking orange
            ctx.beginPath();
            ctx.fillStyle = "rgb(255,128,0)";
            ctx.arc (badx[i], bady[i], 6, 0, Math.PI * 2, true);
            ctx.fill();
        }
        else if (bad_type[i] == 4) {
            // Like a BAWSS
            ctx.fillStyle = "rgb(255,0,0)";
            ctx.fillRect (badx[i] - 20, bady[i] - 16, 40, 8);
            ctx.fillRect (badx[i] - 20, bady[i] - 8, 8, 8);
            ctx.fillRect (badx[i] + 12, bady[i] - 8, 8, 8);
      
            // Health bar
            var maxhealth = 15 + (4 * current_wave);
            if (cyclestep % 4 == 0) ctx.fillStyle = "rgb(255,64,64)";
            ctx.fillRect (0, 0, bad_hp[i] / maxhealth * 480, 6);
        }
        else if (bad_type[i] == 5) {
            // Purple laser
            ctx.fillStyle = "rgb(255,0,255)";
            ctx.fillRect (badx[i] - 1, bady[i] - 6, 3, 6);
        }
        else if (bad_type[i] == 6) {
            // Corkscrew right
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect (badx[i] - 1 - (bad_deltax[i] / 2), bady[i] - 8, bad_deltax[i] + 2, 8);
            ctx.fillRect (badx[i], bady[i] - 4, bad_deltax[i], 2);
        }
        else if (bad_type[i] == 7) {
            // Corkscrew left
            ctx.fillStyle = "rgb(128,128,128)";
            ctx.fillRect (badx[i] - 1 - (bad_deltax[i] / 2), bady[i] - 8, bad_deltax[i] + 2, 8);
            ctx.fillRect (badx[i], bady[i] - 4, bad_deltax[i], 2);
        }
        else if (bad_type[i] == 9000) {
            // Shield boost
            ctx.beginPath();
            ctx.fillStyle = "rgb(0,128,0)";
            ctx.arc (badx[i], bady[i], 6, 0, Math.PI * 2, true);
            ctx.fill();
      
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.font = "bold 10px Arial";
            ctx.textBaseline = "top";
            ctx.fillText ("S", badx[i] - 4, bady[i] -4);
        }
        else if (bad_type[i] == 9001) {
            // Power sphere (increases your power level)
            ctx.beginPath();
            ctx.fillStyle = "rgb(0,128,255)";
            ctx.arc (badx[i], bady[i], 6, 0, Math.PI * 2, true);
            ctx.fill();
      
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.font = "bold 9px Arial";
            ctx.textBaseline = "top";
            ctx.fillText ("P", badx[i] - 4, bady[i] -4);
        }
    
        // Advance explosion animation
        if (bad_type[i] == -1) {
            current_score += 8 + current_wave;
            if (current_score > high_score) high_score = current_score;
        }
        if (bad_type[i] < 0) bad_type[i]--;

        if (bad_type[i] < -4) dead_baddies.push(i);
        else if (badx[i] < -200 || badx[i] > 680 || bady[i] < -400 || bady[i] > 900) {
            dead_baddies.push (i);
        }
    
        badx[i] += bad_deltax[i];
        bady[i] += bad_deltay[i];
    }
  
    for (var i = dead_baddies.length - 1; i >= 0; i--) {
        badx.splice (dead_baddies[i], 1);
        bady.splice (dead_baddies[i], 1);
        bad_type.splice (dead_baddies[i], 1);
        bad_deltax.splice (dead_baddies[i], 1);
        bad_deltay.splice (dead_baddies[i], 1);
        bad_width.splice (dead_baddies[i], 1);
        bad_hp.splice (dead_baddies[i], 1);
    }
}

function draw() {
    var canvas = document.getElementById('thescreen');
    if (canvas.getContext) {
        var ctx = canvas.getContext ('2d');
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect (0, 0, 480, 640);
        starfield (ctx);
        if (is_paused != 1) {
            bullets (ctx);
            baddies (ctx);
            if (game_over != 1) drawship (ctx);
        }
    
        if (is_paused == 1) {
            ctx.fillStyle = "rgb(0,128,255)";
            ctx.font = "bold 30px Arial";
            ctx.textBaseline = "top";
            ctx.fillText ("Paused", 180, 300);
        }
        else if (game_over == 1) {
            ctx.fillStyle = "rgb(255,0,0)";
            ctx.font = "italic 30px Arial";
            ctx.textBaseline = "top";
            ctx.fillText ("GAME OVER", 160, 300);
            ctx.font = "17px Arial";
            ctx.fillText ("Press Enter to try again", 165, 340);
        }
        else if (enemy_count < 0) {
            ctx.fillStyle = "rgb(0,255,255)";
            ctx.font = "bold 30px Arial";
            ctx.textBaseline = "top";
            ctx.fillText ("WAVE " + current_wave, 180, 300);
        }
        ctx.fillStyle = "rgb(0,128,255)";
        ctx.font = "13px Arial";
        ctx.textBaseline = "top";
        ctx.fillText ("Score: " + current_score, 1, 1);
        ctx.fillText ("High: " + high_score, 1, 14);
        if (power_level > 0) {
            ctx.fillStyle = "rgb(0,255,255)";
            ctx.font = "bold 13px Arial";
            ctx.fillText ("Power Level " + power_level, 1, 27);
        }
    }
}

function dowave() {
    var enemytype = Math.floor (Math.random() * 9);
    var leaderx = 0;
    var leadery = 0;
    var leader_deltax = 0;
    var leader_deltay = 0;
    var leader_type = 0;
    var leader_hp = 1;
    var howmany = 0;
    var spacing = 0;
  
    wave_count++;
    if (wave_count == 30) {
        is_boss = 1;
        enemytype = 666;
    }

    if (current_wave >= 7 && enemytype == 0) enemytype = 6;
    if (current_wave >= 10 && enemytype == 7) enemytype = 8;
    if (current_wave < 3 && enemytype == 5) enemytype = 0;
    if (current_wave == 1 && enemytype == 6) enemytype = 1;
    if (current_wave < 3 && enemytype == 8) enemytype = 1;

    if (enemytype == 0 || enemytype == 7) {
        // give the player a bit of a break
    }
    else if (enemytype <= 3) {
        // Vertical wave of death triangles
        leaderx = Math.floor (Math.random() * 380) + 50;
        leadery = -10;
        if (leaderx < 120) leader_deltax = 1;
        else if (leaderx > 360) leader_deltax = -1;
        else leader_deltax = 0;
        leader_deltay = 7;
        howmany = Math.floor (Math.random() * current_wave) + current_wave;
        if (howmany > 13) howmany = 13;
        else if (howmany < 3) howmany = 3;
    
        if (current_wave >= 10) leader_hp = 2;

        for (var i = 0; i < howmany; i++) {
            badx.push (leaderx);
            bady.push (leadery - i * 10);
            bad_type.push (1);
            bad_deltax.push (leader_deltax);
            bad_deltay.push (leader_deltay - i / 3);
            bad_width.push (5);
            bad_hp.push (leader_hp);
        }
    }
    else if (enemytype == 4) {
        // Corkscrew
        var screwed = 1;
        if (current_wave >= 9) screwed = 3;
        else if (current_wave >= 5) screwed = 2;
    
        for (var screw = 0; screw < screwed; screw++) {
            leaderx = Math.floor (Math.random() * 380) + 50;
            leadery = -20;
            if (current_wave >= 7) leader_hp = 3;
            else if (current_wave >= 2) leader_hp = 2;
            else leader_hp = 1;

            howmany = 10 + Math.floor (Math.random() * current_wave) + 1;
            leader_type = Math.floor (Math.random() * 2);
            for (var i = 0; i < howmany; i++) {
                badx.push (leaderx);
                bady.push (leadery - (i * 7));
                bad_type.push (6 + leader_type);
                bad_deltax.push (0);
                bad_deltay.push (7);
                bad_width.push (7);
                bad_hp.push (leader_hp);
            }
        }
    }
    if (enemytype == 5) {
        // Horizontal wave of death triangles
        howmany = Math.floor (Math.random() * current_wave) + current_wave;
        if (howmany > 13) howmany = 13;
        else if (howmany < 3) howmany = 3;
    
        spacing = 380 / howmany;
        for (var i = 0; i < howmany; i++) {
            badx.push (i * spacing + 50);
            bady.push (-20);
            bad_type.push(1);
            bad_deltax.push (0);
            bad_deltay.push (8);
            bad_width.push (5);
            bad_hp.push (1);
        }
    }
    if (enemytype == 6) {
        // One rectangle of doom
        badx.push (Math.floor (Math.random() * 440) + 20);
        bady.push (-5);
        bad_type.push (2);
        bad_deltax.push (0);
        bad_deltay.push (5);
        bad_width.push (16);
        bad_hp.push (7 + current_wave);
    }
    if (enemytype == 8) {
        if (current_wave >= 8) leader_hp = 2;
        else leader_hp = 1;

        // One to three heat-seeking oranges
        badx.push (200);
        bady.push (-30);
        bad_type.push (3);
        bad_deltax.push (-3);
        bad_deltay.push (0);
        bad_width.push (7);
        bad_hp.push (leader_hp);

        badx.push (280);
        bady.push (-30);
        bad_type.push (3);
        bad_deltax.push (3);
        bad_deltay.push (0);
        bad_width.push (7);
        bad_hp.push (leader_hp);

        if (current_wave >= 5) {
            badx.push (240);
            bady.push (-10);
            bad_type.push (3);
            bad_deltax.push (0);
            bad_deltay.push (3);
            bad_width.push (7);
            bad_hp.push (leader_hp);
        }
    }
    else if (enemytype == 666) {
        // Uh oh! It's da boss!
        badx.push (240);
        bady.push (-90);
        bad_type.push (4);
        bad_deltax.push (0);
        bad_deltay.push (2);
        bad_width.push (20);
        bad_hp.push (15 + (4 * current_wave));
    }
}

function enemy_ai() {
    var dead_baddies = new Array;
    for (var i = 0; i < badx.length; i++) {
        if (bad_type[i] == 1) {
            // Death Triangle
            if (Math.floor (Math.random() * (141 - current_wave)) == 0) {
                badx.push (badx[i]);
                bady.push (bady[i] + 5);
                bad_type.push (0);
                bad_deltax.push (bad_deltax[i] * 2);
                bad_deltay.push (11 - bad_deltax[i]);
                bad_width.push (0);
                bad_hp.push (1);
            }

            if (bady[i] > 100 && bady[i] < 300 && cyclestep % 4 == 0) {
                if (shipx > badx[i]) bad_deltax[i]++;
                else if (shipx < badx[i]) bad_deltax[i]--;
      
                if (bad_deltax[i] > 4) bad_deltax[i] = 4;
                if (bad_deltax[i] < -4) bad_deltax[i] = -4;
            }
        }
        else if (bad_type[i] == 2) {
            // Rectangle of DOOM
            if (cyclestep % 4 == 0) {
                badx.push (badx[i]);
                bady.push (bady[i] + 5);
                bad_type.push (0);
                if (cyclestep == 0) {
                    bad_deltax.push (-6);
                    bad_deltay.push (7);
                }
                else if (cyclestep == 8) {
                    bad_deltax.push (6);
                    bad_deltay.push (7);
                }
                else {
                    bad_deltax.push (0);
                    bad_deltay.push (10);
                }
                bad_width.push (0);
                bad_hp.push (1);
            }
            if (bad_deltay[i] < 5) bad_deltay[i]++;
        }
        else if (bad_type[i] == 3) {
            // Heat-seeking Orange
            if (cyclestep % 2 == 0) {
                if (shipx > badx[i]) bad_deltax[i]++;
                else if (shipx < badx[i]) bad_deltax[i]--;
                if (shipy > bady[1]) bad_deltay[i]++;
                else if (shipy < bady[i]) bad_deltay[i]--;
            }
            if (bad_deltax[i] < -8) bad_deltax[i] = -8;
            else if (bad_deltax[i] > 8) bad_deltax[i] = 8;
            if (bad_deltay[i] < -7) bad_deltay[i] = -7;
            else if (bad_deltay[i] > 7) bad_deltay[i] = 7;
        }
        else if (bad_type[i] == 4) {
            // Boss man!
            if (bady[i] > 50) bad_deltay[i] = 0;
            if (badx[i] < 100) bad_deltax[i]++;
            else if (badx[i] > 380) bad_deltax[i]--;
            else {
                if (cyclestep % 8 == 0) bad_deltax[i] += Math.floor (Math.random() * 7) - 3;
            }
      
            if (bad_deltax[i] > 8) bad_deltax[i] = 8;
            else if (bad_deltax[i] < -8) bad_deltax[i] = -8;
      
            if (bady[i] >= 50) {
                if (current_wave >= 3 || (current_wave == 2 && cyclestep % 2 == 0) || (current_wave == 1 && cyclestep % 4 == 0)) {
                    badx.push (badx[i]);
                    bady.push (bady[i]);
                    bad_type.push (0);
                    bad_deltax.push (cyclestep - 8);
                    bad_deltay.push (6);
                    bad_width.push (0);
                    bad_hp.push (1);
                }
                if (bady[i] && current_wave >= 6 && cyclestep % 8 == 0) {
                    badx.push (badx[i]);
                    bady.push (bady[i]);
                    bad_type.push (5);
                    bad_deltax.push (0);
                    bad_deltay.push (9);
                    bad_width.push (1);
                    bad_hp.push (1);
                }
            }
            if (cyclestep % 8 == 0) {
                badx.push (badx[i]);
                bady.push (bady[i]);
                bad_type.push (0);
                bad_deltax.push (bad_deltax[i] / 2);
                bad_deltay.push (-3);
                bad_width.push (1);
                bad_hp.push (1);
            }
            if (current_wave >= 8 && cyclestep == 0 && Math.floor (Math.random() * 15) == 0) {
                // Level 8 and up, the boss fires corkscrews at you in addition to its other attacks.
                var leaderx = Math.floor (Math.random() * 380) + 50;
                var leader_type = Math.floor (Math.random() * 2);
                for (var i = 0; i < 16; i++) {
                    badx.push (leaderx);
                    bady.push (-10 - (i * 7));
                    bad_type.push (6 + leader_type);
                    bad_deltax.push (0);
                    bad_deltay.push (7);
                    bad_width.push (7);
                    bad_hp.push (2);
                }
            }
        }
        else if (bad_type[i] == 6) {
            // Corkscrew right
            if (bady[i] >= 0) {
                bad_deltax[i] = Math.floor (bady[i] / bad_deltay[i]);
                if (bad_deltax[i] % 11 >= 6) {
                    bad_deltax[i] = 11 - (bad_deltax[i] % 11);
                }
                else {
                    bad_deltax[i] = bad_deltax[i] % 11;
                    if (bad_deltax[i] == 0) bad_type[i] = 7;
                }
                bad_deltax[i] = bad_deltax[i] * 2.5;
            }
        }
        else if (bad_type[i] == 7) {
            // Corkscrew left
            if (bady[i] >= 0) {
                bad_deltax[i] = Math.floor (bady[i] / bad_deltay[i]);
                if (bad_deltax[i] % 11 >= 6) {
                    bad_deltax[i] = -11 + (bad_deltax[i] % 11);
                }
                else {
                    bad_deltax[i] = 0 - (bad_deltax[i] % 11);
                    if (bad_deltax[i] == 0) bad_type[i] = 6;
                }
                bad_deltax[i] = bad_deltax[i] * 2.5;
            }
        }
        else if (bad_type[i] == 9000 || bad_type[i] == 9001) {
            // Powerups seek the player
            bad_deltay[i] = 2;
            if (shipx < badx[i]) bad_deltax[i] = -1;
            else if (shipx > badx[i]) bad_deltax[i] = 1;
            else {
                bad_deltax[i] = 0;
                if (shipy > bady[i]) bad_deltay[i] = 3;
            }
        }
        else if (bad_type[i] == -2) {
            // Possibly generate powerups when an enemy dies
            if (Math.floor (Math.random() * 32) == 0 && game_over != 1) {
                if (shields == 1 || Math.floor (Math.random() * 2) == 0) bad_type.push (9001);
                else bad_type.push (9000);
                badx.push (badx[i]);
                bady.push (bady[i]);
                bad_deltax.push (0);
                bad_deltay.push (2);
                bad_width.push (3);
                bad_hp.push (3);
            }
        }
    
        if (badx[i] > shipx - (shipwidth * 2) && badx[i] < shipx + (shipwidth * 2) && bady[i] > shipy - (shipheight * 2) && bady[i] < shipy + (shipheight * 2) && game_over != 1) {
            if (bad_type[i] == 9000) {
                dead_baddies.push (i);
                shields = 1;
            }
            else if (bad_type[i] == 9001) {
                dead_baddies.push (i);
                power_level += 500;
            }
            else if (badx[i] > shipx - shipwidth && badx[i] < shipx + shipwidth && bady[i] > shipy - shipheight && bady[i] < shipy + shipheight) {
                if (shields > 0) {
                    shields = 0;
                    bad_hp[i] -= 3;
                    if (bad_hp[i] < 1) dead_baddies.push (i);
                }
                else {
                    game_over = 1;
                    power_level = 0;
                    is_firing = 0;
                    badx.push (shipx);
                    bady.push (shipy);
                    bad_type.push (-1);
                    bad_deltax.push (vectorx);
                    bad_deltay.push (vectory);
                    bad_width.push (0);
                    bad_hp.push (1);
                }
            }
        }
    }
    for (var i = dead_baddies.length - 1; i >= 0; i--) {
        badx.splice (dead_baddies[i], 1);
        bady.splice (dead_baddies[i], 1);
        bad_type.splice (dead_baddies[i], 1);
        bad_deltax.splice (dead_baddies[i], 1);
        bad_deltay.splice (dead_baddies[i], 1);
        bad_width.splice (dead_baddies[i], 1);
        bad_hp.splice (dead_baddies[i], 1);
    }
}

function move_ship (deltax, deltay) {
    shipx += deltax;
    shipy += deltay;
    var rightborder = 480 - shipwidth;
    var bottomborder = 640 - shipheight;
    var leftborder = shipwidth;
    var topborder = shipheight;
  
    if (shipx > rightborder) {
        shipx = rightborder;
        vectorx = 0;
    }
    if (shipx < leftborder) {
        shipx = leftborder;
        vectorx = 0;
    }
    if (shipy > bottomborder) {
        shipy = bottomborder;
        vectory = 0;
    }
    if (shipy < topborder) {
        shipy = topborder;
        vectory = 0;
    }
}

function timed_count() {
    var d = new Date();
    var start_time = d.getTime();
    if (is_paused != 1) {
        if (is_key_left) vectorx -= 3;
        else if (is_key_right) vectorx += 3;
        if (is_key_up) vectory -= 4;
        else if (is_key_down) vectory += 4;

        if (vectorx > 11) vectorx = 11;
        else if (vectorx < -11) vectorx = -11;
        if (vectory > 13) vectory = 13;
        else if (vectory < -13) vectory = -13;
  
        // Friction. Yeah, I know there's no friction in a vacuum. Fuck you, smartass.
        if (vectorx > 0) vectorx -= 1.5;
        else if (vectorx < 0) vectorx += 1.5;
        if (vectory > 0) vectory -= 1.5;
        else if (vectory < 0) vectory += 1.5;
  
        if (vectorx > -1 && vectorx < 1) vectorx = 0;
        if (vectory > -1 && vectory < 1) vectory = 0;
  
        // Imma firin' ma laser!
        if (is_firing == 1) {
            if (cyclestep % 8 == 0) {
                bulletx.push (shipx - 11);
                bullety.push (shipy);
                bullet_deltax.push (0);
                bullet_deltay.push (-12);
                bullet_type.push (1);
            }
            else if (cyclestep % 8 - 4 == 0) {
                bulletx.push (shipx + 9);
                bullety.push (shipy);
                bullet_deltax.push (0);
                bullet_deltay.push (-12);
                bullet_type.push (1);
            }
            if (power_level > 0) {
                if (cyclestep % 8 - 6 == 0) {
                    bulletx.push (shipx - 18);
                    bullety.push (shipy + 10);
                    if (power_level <= 500) bullet_deltax.push (0);
                    else bullet_deltax.push (-1);
                    bullet_deltay.push (-12);
                    bullet_type.push (1);
                }
                else if (cyclestep % 8 - 2 == 0) {
                    bulletx.push (shipx + 16);
                    bullety.push (shipy + 10);
                    if (power_level <= 500) bullet_deltax.push (0);
                    else bullet_deltax.push (1);
                    bullet_deltay.push (-12);
                    bullet_type.push (1);
                }
                if (power_level > 500 && cyclestep % 2 == 0) {
                    bulletx.push (shipx - 1);
                    bullety.push (shipy - 5);
                    bullet_deltax.push (0);
                    bullet_deltay.push (-20);
                    bullet_type.push (2);
                }
                if (power_level > 500 && cyclestep % 2 == 0) power_level--;
                power_level--;
            }
        }
        if (power_level > 2000 && cyclestep % 2 == 0) power_level--;
        if (power_level > 1000 && cyclestep % 4 == 0) power_level--;
        if (power_level < 0) power_level = 0;
    
        if (is_boss != 1) {
            enemy_count++;
            if (enemy_count >= enemy_freq) {
                enemy_count = 0;
                dowave();
            }
        }
        else if (badx.length == 0) {
            current_wave++;
            is_boss = 0;
            wave_count = 0;
            enemy_count = -100;
        }
  
        enemy_ai();

        move_ship (vectorx, vectory);
        draw();
        cyclestep++;
        if (cyclestep == 16) cyclestep = 0;
    }
    else draw();
  
    d = new Date();
    var time_diff = d.getTime() - start_time;
    if (time_diff >= msec_frame) time_diff = 0;
    else time_diff = msec_frame - time_diff;

    t = setTimeout ("timed_count()", time_diff);
}

function get_key_down (evt) {
    if (game_over != 1) {
        if (evt.keyCode == 37) is_key_left = 1;
        if (evt.keyCode == 39) is_key_right = 1;
        if (evt.keyCode == 38) is_key_up = 1;
        if (evt.keyCode == 40) is_key_down = 1;
        if (evt.keyCode == 17 || evt.keyCode == 16) is_firing = 1;
        if (evt.keyCode == 32) {
            if (is_paused == 1) is_paused = 0;
            else is_paused = 1;
        }
    }
    else if (evt.keyCode == 13) restart_game();
}

function get_key_up (evt) {
    if (evt.keyCode == 37) is_key_left = 0;
    if (evt.keyCode == 39) is_key_right = 0;
    if (evt.keyCode == 38) is_key_up = 0;
    if (evt.keyCode == 40) is_key_down = 0;
    if (evt.keyCode == 17 || evt.keyCode == 16) is_firing = 0;
}
