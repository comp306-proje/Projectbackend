// server.js


const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3001;

        
        this.app.use(cors());

        
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'berke61752',
            database: '306schema',
        });

        
        this.initRoutes();
    }

    async initRoutes() {
        
        this.app.get('/api/data', (req, res) => {

            const number = req.query.number;
            const artistName = req.query.artist;
            const songGenre = req.query.genre;
            const albName = req.query.albumName;
            const songNameToInsert = req.query.songName;
            const songGenreToInsert = req.query.genreToInsert;
            const songID = req.query.songID;
            const artistNameToFilter = req.query.artistNameToFilter;
            const albumID = req.query.albumID;

            let run_query = null;           

            if (number == 1) {
                run_query =
                    `select a.artistid, a.name as artistname, count(s.songid) as songcount
              from artist a
              join album alb on a.artistid = alb.artistid
              join song_inside_album sia on alb.albid = sia.albid
              join song s on sia.songid = s.songid
              where s.songcategory = 'pop'
              group by a.artistid, a.name
              order by songcount desc;`;
            } else if (number == 2) {
                run_query =
                    `select *
              from artist
              where substr(bdate, 1, 4) > '2000';`;
            } else if (number == 3) {
                run_query =
                    `select a.name as favoriteartist, count(u.nickname) as usercount
              from artist a
              join user u on a.name = u.favartist
              group by a.name
              order by usercount desc;`;
            } else if (number == 4) {
                run_query =
                    `select favgenre, count(*) as genrecount
              from user
              where sex = 'female'
              group by favgenre
              order by genrecount desc;`;
            } else if (number == 5) {
                run_query =
                    `select favartist, count(*) as artistcount
              from user
              where year(bdate) > 2000
              group by favartist
              order by artistcount desc;`;
            } else if (number == 6) {
                run_query =
                    `select
              s.songname as mostlikedsong,
              count(l.nickname) as totallikes
              from
              song s
              join
              song_likedby_user l on s.songid = l.songid
              group by
              mostlikedsong
              order by
              totallikes desc;
              `;
            } else if (number == 7) {
                run_query =
                    `select
              s.songid as mostlikedpopsongid,
              s.songname as mostlikedpopsong,
              count(l.nickname) as totallikes
              from
              song s
              join
              song_likedby_user l on s.songid = l.songid
              where
              s.songcategory = 'pop'
              group by
              mostlikedpopsongid, mostlikedpopsong
              order by
              totallikes desc;
              `;
            } else if (number == 8) {
                run_query = `select * from user;`;
            } else if (number == 9) {
                run_query = `select * from song;`;
            } else if (number == 10) {
                run_query = `select * from artist;`;
            } else if (number == 11) {
                run_query = `select albName,publishDate,name  
                from album, artist
                where album.artistID = artist.artistID;`;
            } else if (number == 12) {
                run_query = `select name, songName, songCategory, albName, publishDate
                from artist, song, song_inside_album, album
                where artist.artistID = album.artistID and
                album.albID = song_inside_album.albID and
                song.songID = song_inside_album.songID`;


                if (!artistName.trim() == "") {
                    run_query += ` and name = "${artistName}"`;
                }

                if (!songGenre.trim() == "") {
                    run_query += ` and songCategory = "${songGenre}"`;
                }

                run_query += `;`;
            }

            else if (number == 13) {
                run_query = `select distinct albName from album order by albName;`;

            }

            else if (number == 14) {
                run_query = `insert into song(songID,songName,songCategory) values(${songID}, "${songNameToInsert}", "${songGenreToInsert}")`;
            }

            else if (number == 15) {
                run_query = `select max(songID) + 1 from song;`;
            }

            else if (number == 16) {
                run_query = `select * 
                             from album, artist
                             where artist.artistID = album.artistID and name = "${artistNameToFilter}" and albName = "${albName}";`;
            }
            else if (number == 17) {
                run_query = `select distinct name from artist;`;
            }

            else if (number == 18) {
                run_query = `select albName
                             from album, artist
                             where album.artistID = artist.artistID and
                             artist.name = "${artistNameToFilter}";`;
            }

            else if (number == 19) {
                run_query = `insert into song_inside_album values("${albumID}",${songID});`;
            }

            else if (number == 20) {
                run_query = `select songName from song where songID = ${songID};`;
            }

            else if (number == 21) {
                run_query = `delete from song_inside_album where songID = ${songID};`;
            }

            else if (number == 22) {
                run_query = `delete from song where songID = ${songID};`;
            }



            this.connection.query(run_query, (err, results) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                res.json(results);
            });
        });
    }

    start() {       
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}


const server = new Server();
server.start();
