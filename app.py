from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tpv.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/images'

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Crear directorio de imágenes si no existe
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Modelos de base de datos
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    barcode = db.Column(db.String(50), unique=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    image_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'stock': self.stock,
            'barcode': self.barcode,
            'category_id': self.category_id,
            'image_url': self.image_url
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    products = db.relationship('Product', backref='category', lazy=True)

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(20), default='efectivo')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('SaleItem', backref='sale', lazy=True)

class SaleItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sale.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    product = db.relationship('Product', backref='sale_items')

# Rutas principales
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pos')
def pos():
    products = Product.query.all()
    categories = Category.query.all()
    return render_template('pos.html', products=products, categories=categories)

@app.route('/inventory')
def inventory():
    products = Product.query.all()
    categories = Category.query.all()
    return render_template('inventory.html', products=products, categories=categories)

@app.route('/sales')
def sales():
    sales = Sale.query.order_by(Sale.created_at.desc()).all()
    return render_template('sales.html', sales=sales)

# API Routes
@app.route('/api/products')
def api_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])

@app.route('/api/products/<int:product_id>')
def api_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())

@app.route('/api/products/barcode/<barcode>')
def api_product_by_barcode(barcode):
    product = Product.query.filter_by(barcode=barcode).first()
    if product:
        return jsonify(product.to_dict())
    return jsonify({'error': 'Producto no encontrado'}), 404

@app.route('/api/products', methods=['POST'])
def api_create_product():
    data = request.get_json()
    
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=float(data['price']),
        stock=int(data.get('stock', 0)),
        barcode=data.get('barcode'),
        category_id=data.get('category_id')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def api_update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = float(data.get('price', product.price))
    product.stock = int(data.get('stock', product.stock))
    product.barcode = data.get('barcode', product.barcode)
    product.category_id = data.get('category_id', product.category_id)
    
    db.session.commit()
    
    return jsonify(product.to_dict())

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def api_delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': 'Producto eliminado'})

@app.route('/api/categories')
def api_categories():
    categories = Category.query.all()
    return jsonify([{'id': c.id, 'name': c.name} for c in categories])

@app.route('/api/categories', methods=['POST'])
def api_create_category():
    data = request.get_json()
    category = Category(name=data['name'])
    db.session.add(category)
    db.session.commit()
    
    return jsonify({'id': category.id, 'name': category.name}), 201

@app.route('/api/sales', methods=['POST'])
def api_create_sale():
    data = request.get_json()
    
    # Crear la venta
    sale = Sale(
        total=float(data['total']),
        payment_method=data.get('payment_method', 'efectivo')
    )
    db.session.add(sale)
    db.session.flush()  # Para obtener el ID
    
    # Crear los items de la venta y actualizar stock
    for item_data in data['items']:
        product = Product.query.get(item_data['product_id'])
        if not product:
            return jsonify({'error': f'Producto {item_data["product_id"]} no encontrado'}), 400
        
        if product.stock < item_data['quantity']:
            return jsonify({'error': f'Stock insuficiente para {product.name}'}), 400
        
        # Crear item de venta
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=product.id,
            quantity=item_data['quantity'],
            unit_price=product.price,
            subtotal=product.price * item_data['quantity']
        )
        db.session.add(sale_item)
        
        # Actualizar stock
        product.stock -= item_data['quantity']
    
    db.session.commit()
    
    return jsonify({
        'id': sale.id,
        'total': sale.total,
        'payment_method': sale.payment_method,
        'created_at': sale.created_at.isoformat()
    }), 201

@app.route('/api/sales')
def api_sales():
    sales = Sale.query.order_by(Sale.created_at.desc()).all()
    sales_data = []
    
    for sale in sales:
        sale_data = {
            'id': sale.id,
            'total': sale.total,
            'payment_method': sale.payment_method,
            'created_at': sale.created_at.isoformat(),
            'items': []
        }
        
        for item in sale.items:
            sale_data['items'].append({
                'product_name': item.product.name,
                'quantity': item.quantity,
                'unit_price': item.unit_price,
                'subtotal': item.subtotal
            })
        
        sales_data.append(sale_data)
    
    return jsonify(sales_data)

# Inicializar base de datos
def create_tables():
    db.create_all()
    
    # Crear categorías por defecto si no existen
    if not Category.query.first():
        default_categories = ['Bebidas', 'Comida', 'Snacks', 'Limpieza', 'Otros']
        for cat_name in default_categories:
            category = Category(name=cat_name)
            db.session.add(category)
        
        db.session.flush()  # Para obtener los IDs de las categorías
        
        # Productos de ejemplo
        bebidas = Category.query.filter_by(name='Bebidas').first()
        comida = Category.query.filter_by(name='Comida').first()
        
        example_products = [
            Product(name='Coca Cola 500ml', price=2.50, stock=50, barcode='7501055300006', category=bebidas),
            Product(name='Agua Natural 1L', price=1.00, stock=100, barcode='7501055300007', category=bebidas),
            Product(name='Pan Integral', price=3.50, stock=20, barcode='7501055300008', category=comida),
            Product(name='Leche Entera 1L', price=4.20, stock=30, barcode='7501055300009', category=bebidas),
            Product(name='Huevos 12 piezas', price=6.50, stock=25, barcode='7501055300010', category=comida),
        ]
        
        for product in example_products:
            db.session.add(product)
        
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        create_tables()
    app.run(debug=True, host='0.0.0.0', port=5000)