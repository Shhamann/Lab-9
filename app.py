from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///workouts.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# Модель пользователя
class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    steps = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {"id": self.id, "steps": self.steps, "date": self.date.isoformat()}


# Создание базы данных
with app.app_context():
    db.create_all()


# Главная страница (фронтенд)
@app.route("/")
def index():
    return render_template("index.html")


# Получение всех пользователей
@app.route("/api/workouts", methods=["GET"])
def get_workouts():
    workouts = Workout.query.all()
    return jsonify([workout.to_dict() for workout in workouts])


# Добавление тренировки
@app.route("/api/workouts", methods=["POST"])
def add_workout():
    data = request.get_json()
    date_obj = datetime.strptime(data["date"], "%Y-%m-%d").date()
    new_workout = Workout(steps=data["steps"], date=date_obj)
    db.session.add(new_workout)
    db.session.commit()
    return jsonify(new_workout.to_dict()), 201


# Удаление тренировки
@app.route("/api/workouts/<int:workout_id>", methods=["DELETE"])
def delete_workout(workout_id):
    workout = Workout.query.get(workout_id)
    if not workout:
        return jsonify({"error": "Workout not found"}), 404
    db.session.delete(workout)
    db.session.commit()
    return jsonify({"message": "Workout deleted successfully"})

#  Сумма шагов
@app.route("/api/workouts/total_steps", methods=["GET"])
def get_total_steps():
    total = db.session.query(func.sum(Workout.steps)).scalar() 
    return jsonify({"total_steps": total if total else 0})

# Удаление всех тренировок
@app.route('/api/workouts', methods=['DELETE'])
def delete_all_workouts():
    db.session.query(Workout).delete()
    db.session.commit()
    return jsonify({'message': 'All workout deleted successfully'}), 200

if __name__ == "__main__":
    app.run(debug=True)
