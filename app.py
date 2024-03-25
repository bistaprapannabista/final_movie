from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import pandas as pd
import pickle
import requests
from models import db, Movie

app = Flask(__name__)
CORS(app)

def fetch_poster(movie_id):
    url = "https://api.themoviedb.org/3/movie/{}?api_key=4bf004fca9ac8416fe3e7761e9ee4a0c&language=en-US".format(movie_id)
    data = requests.get(url)
    data = data.json()
    poster_path = data['poster_path']
    return poster_path

def get_movie_recommendations(movie):
    data = {}
    cosine = []
    euclidean = []
    movies = pickle.load(open('movie_list.pkl', 'rb'))
    # similarity = pickle.load(open('similarity.pkl','rb'))
    cosine_similarity = pickle.load(open('cosine_similarity.pkl', 'rb'))
    euclidean_distances = pickle.load(open('euclidean_distances.pkl','rb'))
    index = movies[movies['title'] == movie].index
    if len(index) == 0:
        return data, "Movie not found."

    index = index[0]
    # distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    distances_cosine = sorted(list(enumerate(cosine_similarity[index])), reverse=True, key=lambda x: x[1])
    distances_euclidean = sorted(list(enumerate(euclidean_distances[index])), reverse=False, key=lambda x: x[1])

    for i in distances_cosine[1:6]:
        movie_id = movies.iloc[i[0]].movie_id
        cosine.append({
            "id": str(movie_id),
            "original_title": movies.iloc[i[0]].title,
            "poster_path": fetch_poster(movie_id),
            "similarity": i[1]
        })
        data["cosine"]=cosine

    for i in distances_euclidean[1:6]:
        movie_id = movies.iloc[i[0]].movie_id
        euclidean.append({
            "id": str(movie_id),
            "original_title": movies.iloc[i[0]].title,
            "poster_path": fetch_poster(movie_id),
            "similarity":i[1]
        })
        data["euclidean"]=euclidean

    return data, "Data found successfully."

@app.route('/api/movies-list', methods=['GET'])
def get_all_movies():
    data=[];
    try:
        with open('movie_list.pkl', 'rb') as file:
            movies = pickle.load(file)
            if 'title' in movies.columns:  
                movies = movies['title'].tolist()
                for i in movies:
                    data.append({"value":i,"label":i})
                return {"data": data}
            else:
                return {"message": "Title column not found in the data."}, 500
    except FileNotFoundError:
        return {"message": "File not found."}, 500
    except Exception as e:
        return {"message": f"Error: {str(e)}"}, 500

@app.route('/api/recommend', methods=['GET'])
def recommend():
    movie = request.args.get('name')
    
    if not movie:
        return jsonify({"message": "Please provide a 'name' parameter."}), 400

    try:
        data, message = get_movie_recommendations(movie)
        return jsonify({"data": data, "message": message}), 200
    except FileNotFoundError:
        abort(500, "Files not found. Please check file paths.")
    except Exception as e:
        abort(500, f"Error: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)
