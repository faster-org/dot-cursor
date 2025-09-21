export default {
	title: "TensorFlow Machine Learning Development",
	tags: ["tensorflow", "machine-learning", "deep-learning", "ai", "neural-networks"],
	languages: ["python"],
	description:
		"Comprehensive guide for building machine learning models with TensorFlow, including neural networks, training pipelines, and deployment strategies.",
	content: `# TensorFlow Machine Learning Development

## 1. TensorFlow Setup and Environment Configuration

### Installation and Environment Setup
\`\`\`python
# requirements.txt
tensorflow==2.13.0
tensorflow-datasets==4.9.2
tensorflow-addons==0.21.0
tensorboard==2.13.0
scikit-learn==1.3.0
matplotlib==3.7.1
seaborn==0.12.2
pandas==2.0.3
numpy==1.24.3
pillow==10.0.0
opencv-python==4.8.0.74

# Virtual environment setup
python -m venv tf_env
source tf_env/bin/activate  # On Windows: tf_env\\Scripts\\activate
pip install -r requirements.txt

# Verify installation
python -c "import tensorflow as tf; print(tf.__version__); print(tf.config.list_physical_devices())"
\`\`\`

### Basic TensorFlow Configuration
\`\`\`python
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple, List, Optional, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# TensorFlow configuration
class TensorFlowConfig:
    def __init__(self):
        self.setup_gpu()
        self.setup_memory_growth()
        self.setup_mixed_precision()

    def setup_gpu(self):
        """Configure GPU settings"""
        gpus = tf.config.experimental.list_physical_devices('GPU')
        if gpus:
            try:
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                logger.info(f"Found {len(gpus)} GPU(s)")
            except RuntimeError as e:
                logger.error(f"GPU configuration error: {e}")
        else:
            logger.info("No GPU found, using CPU")

    def setup_memory_growth(self):
        """Enable memory growth to avoid allocating all GPU memory"""
        gpus = tf.config.experimental.list_physical_devices('GPU')
        if gpus:
            try:
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
            except RuntimeError:
                pass

    def setup_mixed_precision(self):
        """Enable mixed precision for faster training"""
        policy = tf.keras.mixed_precision.Policy('mixed_float16')
        tf.keras.mixed_precision.set_global_policy(policy)
        logger.info("Mixed precision enabled")

# Initialize configuration
config = TensorFlowConfig()

# Set random seeds for reproducibility
def set_seeds(seed: int = 42):
    """Set random seeds for reproducible results"""
    np.random.seed(seed)
    tf.random.set_seed(seed)
    import random
    random.seed(seed)

set_seeds(42)
\`\`\`

## 2. Data Preprocessing and Pipeline Creation

### Data Loading and Preprocessing
\`\`\`python
import tensorflow_datasets as tfds
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder

class DataPreprocessor:
    """Comprehensive data preprocessing pipeline"""

    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()

    def load_image_dataset(self, dataset_name: str, split: str = 'train') -> tf.data.Dataset:
        """Load image dataset using TensorFlow Datasets"""
        dataset, info = tfds.load(
            dataset_name,
            split=split,
            as_supervised=True,
            with_info=True
        )

        logger.info(f"Dataset: {dataset_name}")
        logger.info(f"Number of classes: {info.features['label'].num_classes}")
        logger.info(f"Dataset size: {info.splits[split].num_examples}")

        return dataset, info

    def preprocess_images(self, dataset: tf.data.Dataset,
                         image_size: Tuple[int, int] = (224, 224),
                         normalize: bool = True) -> tf.data.Dataset:
        """Preprocess images with resizing and normalization"""

        def preprocess_fn(image, label):
            # Resize image
            image = tf.image.resize(image, image_size)

            # Normalize pixel values
            if normalize:
                image = tf.cast(image, tf.float32) / 255.0

            return image, label

        return dataset.map(preprocess_fn, num_parallel_calls=tf.data.AUTOTUNE)

    def create_data_augmentation(self) -> tf.keras.Sequential:
        """Create data augmentation pipeline"""
        return tf.keras.Sequential([
            tf.keras.layers.RandomFlip("horizontal"),
            tf.keras.layers.RandomRotation(0.1),
            tf.keras.layers.RandomZoom(0.1),
            tf.keras.layers.RandomContrast(0.1),
            tf.keras.layers.RandomBrightness(0.1),
        ])

    def create_tf_dataset(self, X: np.ndarray, y: np.ndarray,
                         batch_size: int = 32,
                         shuffle: bool = True) -> tf.data.Dataset:
        """Create TensorFlow dataset from numpy arrays"""
        dataset = tf.data.Dataset.from_tensor_slices((X, y))

        if shuffle:
            dataset = dataset.shuffle(buffer_size=1000)

        dataset = dataset.batch(batch_size)
        dataset = dataset.prefetch(tf.data.AUTOTUNE)

        return dataset

    def prepare_text_data(self, texts: List[str], labels: List[str],
                         max_length: int = 512,
                         vocab_size: int = 10000) -> Tuple[tf.data.Dataset, tf.keras.utils.StringLookup]:
        """Prepare text data for NLP models"""

        # Create string lookup layer for tokenization
        vectorizer = tf.keras.utils.StringLookup(
            max_tokens=vocab_size,
            output_sequence_length=max_length
        )

        # Adapt vectorizer to texts
        vectorizer.adapt(texts)

        # Encode labels
        encoded_labels = self.label_encoder.fit_transform(labels)

        # Create dataset
        def preprocess_text(text, label):
            return vectorizer(text), label

        dataset = tf.data.Dataset.from_tensor_slices((texts, encoded_labels))
        dataset = dataset.map(preprocess_text)

        return dataset, vectorizer

# Example usage
preprocessor = DataPreprocessor()

# Load CIFAR-10 dataset
train_dataset, info = preprocessor.load_image_dataset('cifar10', 'train')
test_dataset, _ = preprocessor.load_image_dataset('cifar10', 'test')

# Preprocess images
train_dataset = preprocessor.preprocess_images(train_dataset)
test_dataset = preprocessor.preprocess_images(test_dataset)

# Create data augmentation
data_augmentation = preprocessor.create_data_augmentation()

# Prepare datasets for training
BATCH_SIZE = 32
BUFFER_SIZE = 1000

train_dataset = train_dataset.shuffle(BUFFER_SIZE).batch(BATCH_SIZE)
test_dataset = test_dataset.batch(BATCH_SIZE)

# Prefetch for performance
train_dataset = train_dataset.prefetch(tf.data.AUTOTUNE)
test_dataset = test_dataset.prefetch(tf.data.AUTOTUNE)
\`\`\`

## 3. Neural Network Architecture Design

### Convolutional Neural Networks (CNNs)
\`\`\`python
from tensorflow.keras import layers, models, regularizers
from tensorflow.keras.applications import ResNet50, EfficientNetB0, VGG16

class CNNArchitectures:
    """Collection of CNN architectures for different tasks"""

    @staticmethod
    def create_simple_cnn(input_shape: Tuple[int, int, int],
                         num_classes: int) -> tf.keras.Model:
        """Create a simple CNN for image classification"""

        model = models.Sequential([
            # First convolutional block
            layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),

            # Second convolutional block
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),

            # Third convolutional block
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),

            # Dense layers
            layers.Flatten(),
            layers.Dense(512, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(num_classes, activation='softmax')
        ])

        return model

    @staticmethod
    def create_residual_block(x, filters: int, kernel_size: int = 3,
                            stride: int = 1, use_bias: bool = False):
        """Create a residual block"""
        shortcut = x

        # First convolution
        x = layers.Conv2D(filters, kernel_size, strides=stride,
                         padding='same', use_bias=use_bias)(x)
        x = layers.BatchNormalization()(x)
        x = layers.ReLU()(x)

        # Second convolution
        x = layers.Conv2D(filters, kernel_size, strides=1,
                         padding='same', use_bias=use_bias)(x)
        x = layers.BatchNormalization()(x)

        # Adjust shortcut dimensions if needed
        if stride != 1 or shortcut.shape[-1] != filters:
            shortcut = layers.Conv2D(filters, 1, strides=stride,
                                   padding='same', use_bias=use_bias)(shortcut)
            shortcut = layers.BatchNormalization()(shortcut)

        # Add shortcut
        x = layers.Add()([x, shortcut])
        x = layers.ReLU()(x)

        return x

    @staticmethod
    def create_custom_resnet(input_shape: Tuple[int, int, int],
                           num_classes: int,
                           blocks: List[int] = [2, 2, 2, 2]) -> tf.keras.Model:
        """Create custom ResNet architecture"""

        inputs = layers.Input(shape=input_shape)

        # Initial convolution
        x = layers.Conv2D(64, 7, strides=2, padding='same', use_bias=False)(inputs)
        x = layers.BatchNormalization()(x)
        x = layers.ReLU()(x)
        x = layers.MaxPooling2D(3, strides=2, padding='same')(x)

        # Residual blocks
        filters = 64
        for i, num_blocks in enumerate(blocks):
            stride = 1 if i == 0 else 2
            for j in range(num_blocks):
                block_stride = stride if j == 0 else 1
                x = CNNArchitectures.create_residual_block(x, filters, stride=block_stride)
            filters *= 2

        # Global average pooling and classification
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.Dense(num_classes, activation='softmax')(x)

        model = models.Model(inputs, x, name='custom_resnet')
        return model

    @staticmethod
    def create_transfer_learning_model(base_model_name: str,
                                     input_shape: Tuple[int, int, int],
                                     num_classes: int,
                                     trainable_layers: int = 0) -> tf.keras.Model:
        """Create transfer learning model"""

        # Load pre-trained model
        base_models = {
            'resnet50': ResNet50,
            'efficientnet': EfficientNetB0,
            'vgg16': VGG16
        }

        base_model = base_models[base_model_name](
            weights='imagenet',
            include_top=False,
            input_shape=input_shape
        )

        # Freeze base model layers
        base_model.trainable = False

        # Unfreeze top layers if specified
        if trainable_layers > 0:
            for layer in base_model.layers[-trainable_layers:]:
                layer.trainable = True

        # Add custom classification head
        inputs = tf.keras.Input(shape=input_shape)
        x = base_model(inputs, training=False)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.Dropout(0.2)(x)
        outputs = layers.Dense(num_classes, activation='softmax')(x)

        model = tf.keras.Model(inputs, outputs)
        return model

# Example usage
# Simple CNN
simple_model = CNNArchitectures.create_simple_cnn((32, 32, 3), 10)

# Custom ResNet
resnet_model = CNNArchitectures.create_custom_resnet((224, 224, 3), 1000)

# Transfer learning model
transfer_model = CNNArchitectures.create_transfer_learning_model(
    'resnet50', (224, 224, 3), 10, trainable_layers=10
)
\`\`\`

### Recurrent Neural Networks (RNNs) for Sequence Data
\`\`\`python
class RNNArchitectures:
    """Collection of RNN architectures for sequence tasks"""

    @staticmethod
    def create_lstm_classifier(vocab_size: int,
                              embedding_dim: int = 128,
                              lstm_units: int = 64,
                              num_classes: int = 2,
                              max_length: int = 512) -> tf.keras.Model:
        """Create LSTM model for text classification"""

        model = models.Sequential([
            layers.Embedding(vocab_size, embedding_dim, input_length=max_length),
            layers.SpatialDropout1D(0.2),

            layers.LSTM(lstm_units, dropout=0.2, recurrent_dropout=0.2,
                       return_sequences=True),
            layers.LSTM(lstm_units//2, dropout=0.2, recurrent_dropout=0.2),

            layers.Dense(64, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(num_classes, activation='softmax')
        ])

        return model

    @staticmethod
    def create_bidirectional_lstm(vocab_size: int,
                                 embedding_dim: int = 128,
                                 lstm_units: int = 64,
                                 num_classes: int = 2) -> tf.keras.Model:
        """Create bidirectional LSTM model"""

        model = models.Sequential([
            layers.Embedding(vocab_size, embedding_dim),
            layers.SpatialDropout1D(0.2),

            layers.Bidirectional(layers.LSTM(lstm_units, dropout=0.2,
                                           recurrent_dropout=0.2,
                                           return_sequences=True)),
            layers.Bidirectional(layers.LSTM(lstm_units//2, dropout=0.2,
                                           recurrent_dropout=0.2)),

            layers.Dense(64, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(num_classes, activation='softmax')
        ])

        return model

    @staticmethod
    def create_gru_sequence_to_sequence(vocab_size: int,
                                       embedding_dim: int = 256,
                                       hidden_units: int = 512,
                                       max_length: int = 100) -> tf.keras.Model:
        """Create GRU sequence-to-sequence model"""

        # Encoder
        encoder_inputs = layers.Input(shape=(None,))
        encoder_embedding = layers.Embedding(vocab_size, embedding_dim)(encoder_inputs)
        encoder_gru = layers.GRU(hidden_units, return_state=True)
        encoder_outputs, encoder_state = encoder_gru(encoder_embedding)

        # Decoder
        decoder_inputs = layers.Input(shape=(None,))
        decoder_embedding = layers.Embedding(vocab_size, embedding_dim)(decoder_inputs)
        decoder_gru = layers.GRU(hidden_units, return_sequences=True, return_state=True)
        decoder_outputs, _ = decoder_gru(decoder_embedding, initial_state=encoder_state)
        decoder_dense = layers.Dense(vocab_size, activation='softmax')
        decoder_outputs = decoder_dense(decoder_outputs)

        model = models.Model([encoder_inputs, decoder_inputs], decoder_outputs)
        return model

    @staticmethod
    def create_attention_lstm(vocab_size: int,
                             embedding_dim: int = 128,
                             lstm_units: int = 64,
                             num_classes: int = 2) -> tf.keras.Model:
        """Create LSTM with attention mechanism"""

        inputs = layers.Input(shape=(None,))
        x = layers.Embedding(vocab_size, embedding_dim)(inputs)

        # LSTM layer that returns sequences
        lstm_out = layers.LSTM(lstm_units, return_sequences=True)(x)

        # Attention mechanism
        attention = layers.Dense(1, activation='tanh')(lstm_out)
        attention = layers.Flatten()(attention)
        attention = layers.Activation('softmax')(attention)
        attention = layers.RepeatVector(lstm_units)(attention)
        attention = layers.Permute([2, 1])(attention)

        # Apply attention weights
        sent_representation = layers.Multiply()([lstm_out, attention])
        sent_representation = layers.Lambda(lambda xin: tf.keras.backend.sum(xin, axis=1))(sent_representation)

        # Classification layer
        outputs = layers.Dense(num_classes, activation='softmax')(sent_representation)

        model = models.Model(inputs, outputs)
        return model
\`\`\`

## 4. Training Pipeline and Optimization

### Custom Training Loop and Callbacks
\`\`\`python
class ModelTrainer:
    """Comprehensive model training pipeline"""

    def __init__(self, model: tf.keras.Model):
        self.model = model
        self.history = None
        self.best_weights = None

    def compile_model(self, learning_rate: float = 0.001,
                     loss: str = 'sparse_categorical_crossentropy',
                     metrics: List[str] = ['accuracy']) -> None:
        """Compile model with optimizer and metrics"""

        optimizer = tf.keras.optimizers.Adam(
            learning_rate=learning_rate,
            beta_1=0.9,
            beta_2=0.999,
            epsilon=1e-7
        )

        self.model.compile(
            optimizer=optimizer,
            loss=loss,
            metrics=metrics
        )

    def create_callbacks(self, patience: int = 10,
                        min_delta: float = 0.001,
                        save_path: str = 'best_model.h5') -> List[tf.keras.callbacks.Callback]:
        """Create training callbacks"""

        callbacks = [
            # Early stopping
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=patience,
                min_delta=min_delta,
                restore_best_weights=True,
                verbose=1
            ),

            # Model checkpoint
            tf.keras.callbacks.ModelCheckpoint(
                save_path,
                monitor='val_loss',
                save_best_only=True,
                save_weights_only=False,
                verbose=1
            ),

            # Learning rate reduction
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-7,
                verbose=1
            ),

            # TensorBoard logging
            tf.keras.callbacks.TensorBoard(
                log_dir='./logs',
                histogram_freq=1,
                write_graph=True,
                write_images=True
            ),

            # CSV logger
            tf.keras.callbacks.CSVLogger('training_log.csv'),

            # Custom callback for logging
            self.CustomLoggingCallback()
        ]

        return callbacks

    class CustomLoggingCallback(tf.keras.callbacks.Callback):
        """Custom callback for detailed logging"""

        def on_epoch_end(self, epoch, logs=None):
            logs = logs or {}
            logger.info(f"Epoch {epoch + 1}")
            for metric, value in logs.items():
                logger.info(f"  {metric}: {value:.4f}")

    def train(self, train_dataset: tf.data.Dataset,
              validation_dataset: tf.data.Dataset,
              epochs: int = 100,
              callbacks: Optional[List] = None) -> tf.keras.callbacks.History:
        """Train the model"""

        if callbacks is None:
            callbacks = self.create_callbacks()

        logger.info("Starting training...")
        logger.info(f"Model parameters: {self.model.count_params():,}")

        self.history = self.model.fit(
            train_dataset,
            epochs=epochs,
            validation_data=validation_dataset,
            callbacks=callbacks,
            verbose=1
        )

        return self.history

    def evaluate(self, test_dataset: tf.data.Dataset) -> Dict[str, float]:
        """Evaluate model on test data"""

        logger.info("Evaluating model...")
        results = self.model.evaluate(test_dataset, verbose=1)

        # Convert results to dictionary
        metric_names = self.model.metrics_names
        results_dict = dict(zip(metric_names, results))

        logger.info("Evaluation results:")
        for metric, value in results_dict.items():
            logger.info(f"  {metric}: {value:.4f}")

        return results_dict

    def plot_training_history(self, save_path: Optional[str] = None) -> None:
        """Plot training history"""

        if self.history is None:
            logger.error("No training history found. Train the model first.")
            return

        fig, axes = plt.subplots(2, 2, figsize=(15, 10))

        # Plot training & validation accuracy
        axes[0, 0].plot(self.history.history['accuracy'], label='Training Accuracy')
        axes[0, 0].plot(self.history.history['val_accuracy'], label='Validation Accuracy')
        axes[0, 0].set_title('Model Accuracy')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()

        # Plot training & validation loss
        axes[0, 1].plot(self.history.history['loss'], label='Training Loss')
        axes[0, 1].plot(self.history.history['val_loss'], label='Validation Loss')
        axes[0, 1].set_title('Model Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()

        # Plot learning rate if available
        if 'lr' in self.history.history:
            axes[1, 0].plot(self.history.history['lr'])
            axes[1, 0].set_title('Learning Rate')
            axes[1, 0].set_xlabel('Epoch')
            axes[1, 0].set_ylabel('Learning Rate')
            axes[1, 0].set_yscale('log')

        # Remove empty subplot
        fig.delaxes(axes[1, 1])

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

# Example usage
model = CNNArchitectures.create_simple_cnn((32, 32, 3), 10)
trainer = ModelTrainer(model)

# Compile model
trainer.compile_model(learning_rate=0.001)

# Train model
history = trainer.train(
    train_dataset=train_dataset,
    validation_dataset=test_dataset,
    epochs=50
)

# Evaluate model
results = trainer.evaluate(test_dataset)

# Plot training history
trainer.plot_training_history('training_history.png')
\`\`\`

## 5. Advanced Techniques and Custom Components

### Custom Layers and Loss Functions
\`\`\`python
class CustomLayers:
    """Collection of custom TensorFlow layers"""

    class AttentionLayer(layers.Layer):
        """Custom attention layer"""

        def __init__(self, units, **kwargs):
            super().__init__(**kwargs)
            self.units = units
            self.W = None
            self.U = None
            self.V = None

        def build(self, input_shape):
            self.W = self.add_weight(
                shape=(input_shape[-1], self.units),
                initializer='random_normal',
                trainable=True,
                name='attention_W'
            )
            self.U = self.add_weight(
                shape=(input_shape[-1], self.units),
                initializer='random_normal',
                trainable=True,
                name='attention_U'
            )
            self.V = self.add_weight(
                shape=(self.units, 1),
                initializer='random_normal',
                trainable=True,
                name='attention_V'
            )
            super().build(input_shape)

        def call(self, inputs):
            # Calculate attention scores
            score = tf.nn.tanh(tf.tensordot(inputs, self.W, axes=1) +
                             tf.tensordot(inputs, self.U, axes=1))
            attention_weights = tf.nn.softmax(tf.tensordot(score, self.V, axes=1), axis=1)

            # Apply attention weights
            context_vector = attention_weights * inputs
            context_vector = tf.reduce_sum(context_vector, axis=1)

            return context_vector

        def get_config(self):
            config = super().get_config()
            config.update({'units': self.units})
            return config

    class ResidualBlock(layers.Layer):
        """Custom residual block layer"""

        def __init__(self, filters, kernel_size=3, stride=1, **kwargs):
            super().__init__(**kwargs)
            self.filters = filters
            self.kernel_size = kernel_size
            self.stride = stride

            self.conv1 = layers.Conv2D(filters, kernel_size, stride, padding='same')
            self.bn1 = layers.BatchNormalization()
            self.conv2 = layers.Conv2D(filters, kernel_size, 1, padding='same')
            self.bn2 = layers.BatchNormalization()

            self.shortcut_conv = None
            self.shortcut_bn = None

        def build(self, input_shape):
            if self.stride != 1 or input_shape[-1] != self.filters:
                self.shortcut_conv = layers.Conv2D(self.filters, 1, self.stride, padding='same')
                self.shortcut_bn = layers.BatchNormalization()
            super().build(input_shape)

        def call(self, inputs, training=None):
            x = self.conv1(inputs)
            x = self.bn1(x, training=training)
            x = tf.nn.relu(x)

            x = self.conv2(x)
            x = self.bn2(x, training=training)

            # Shortcut connection
            shortcut = inputs
            if self.shortcut_conv is not None:
                shortcut = self.shortcut_conv(inputs)
                shortcut = self.shortcut_bn(shortcut, training=training)

            x = x + shortcut
            return tf.nn.relu(x)

class CustomLosses:
    """Collection of custom loss functions"""

    @staticmethod
    def focal_loss(alpha=0.25, gamma=2.0):
        """Focal loss for addressing class imbalance"""

        def focal_loss_fn(y_true, y_pred):
            # Convert to one-hot if needed
            if len(y_true.shape) == 1:
                y_true = tf.one_hot(tf.cast(y_true, tf.int32), tf.shape(y_pred)[-1])

            # Calculate cross entropy
            ce_loss = tf.keras.losses.categorical_crossentropy(y_true, y_pred)

            # Calculate focal weight
            p_t = tf.where(tf.equal(y_true, 1), y_pred, 1 - y_pred)
            alpha_t = tf.where(tf.equal(y_true, 1), alpha, 1 - alpha)
            focal_weight = alpha_t * tf.pow(1 - p_t, gamma)

            # Apply focal weight
            focal_loss = focal_weight * ce_loss

            return tf.reduce_mean(focal_loss)

        return focal_loss_fn

    @staticmethod
    def dice_loss():
        """Dice loss for segmentation tasks"""

        def dice_loss_fn(y_true, y_pred):
            smooth = 1e-6

            # Flatten tensors
            y_true_flat = tf.reshape(y_true, [-1])
            y_pred_flat = tf.reshape(y_pred, [-1])

            # Calculate intersection and union
            intersection = tf.reduce_sum(y_true_flat * y_pred_flat)
            union = tf.reduce_sum(y_true_flat) + tf.reduce_sum(y_pred_flat)

            # Calculate dice coefficient
            dice = (2.0 * intersection + smooth) / (union + smooth)

            return 1.0 - dice

        return dice_loss_fn

    @staticmethod
    def contrastive_loss(margin=1.0):
        """Contrastive loss for siamese networks"""

        def contrastive_loss_fn(y_true, y_pred):
            # y_true: 1 for similar pairs, 0 for dissimilar pairs
            # y_pred: euclidean distance between embeddings

            pos_loss = y_true * tf.square(y_pred)
            neg_loss = (1 - y_true) * tf.square(tf.maximum(margin - y_pred, 0))

            return tf.reduce_mean(0.5 * (pos_loss + neg_loss))

        return contrastive_loss_fn

class CustomMetrics:
    """Collection of custom metrics"""

    class F1Score(tf.keras.metrics.Metric):
        """F1 Score metric"""

        def __init__(self, name='f1_score', **kwargs):
            super().__init__(name=name, **kwargs)
            self.precision = tf.keras.metrics.Precision()
            self.recall = tf.keras.metrics.Recall()

        def update_state(self, y_true, y_pred, sample_weight=None):
            self.precision.update_state(y_true, y_pred, sample_weight)
            self.recall.update_state(y_true, y_pred, sample_weight)

        def result(self):
            p = self.precision.result()
            r = self.recall.result()
            return 2 * ((p * r) / (p + r + tf.keras.backend.epsilon()))

        def reset_state(self):
            self.precision.reset_state()
            self.recall.reset_state()

    class IoU(tf.keras.metrics.Metric):
        """Intersection over Union metric for segmentation"""

        def __init__(self, name='iou', **kwargs):
            super().__init__(name=name, **kwargs)
            self.intersection = self.add_weight(name='intersection', initializer='zeros')
            self.union = self.add_weight(name='union', initializer='zeros')

        def update_state(self, y_true, y_pred, sample_weight=None):
            y_pred = tf.cast(y_pred > 0.5, tf.float32)
            y_true = tf.cast(y_true, tf.float32)

            intersection = tf.reduce_sum(y_true * y_pred)
            union = tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) - intersection

            self.intersection.assign_add(intersection)
            self.union.assign_add(union)

        def result(self):
            return self.intersection / (self.union + tf.keras.backend.epsilon())

        def reset_state(self):
            self.intersection.assign(0)
            self.union.assign(0)
\`\`\`

## 6. Model Interpretation and Visualization

### Model Analysis and Visualization Tools
\`\`\`python
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

class ModelAnalyzer:
    """Tools for model analysis and interpretation"""

    def __init__(self, model: tf.keras.Model):
        self.model = model

    def plot_model_architecture(self, save_path: str = 'model_architecture.png'):
        """Visualize model architecture"""
        tf.keras.utils.plot_model(
            self.model,
            to_file=save_path,
            show_shapes=True,
            show_layer_names=True,
            rankdir='TB',
            expand_nested=True,
            dpi=96
        )

    def analyze_predictions(self, dataset: tf.data.Dataset,
                          class_names: List[str]) -> Dict:
        """Analyze model predictions"""

        y_true = []
        y_pred = []

        for batch_x, batch_y in dataset:
            predictions = self.model.predict(batch_x, verbose=0)
            y_pred.extend(np.argmax(predictions, axis=1))
            y_true.extend(batch_y.numpy())

        # Classification report
        report = classification_report(
            y_true, y_pred,
            target_names=class_names,
            output_dict=True
        )

        # Confusion matrix
        cm = confusion_matrix(y_true, y_pred)

        return {
            'classification_report': report,
            'confusion_matrix': cm,
            'y_true': y_true,
            'y_pred': y_pred
        }

    def plot_confusion_matrix(self, cm: np.ndarray,
                            class_names: List[str],
                            save_path: Optional[str] = None):
        """Plot confusion matrix"""

        plt.figure(figsize=(10, 8))
        sns.heatmap(
            cm,
            annot=True,
            fmt='d',
            cmap='Blues',
            xticklabels=class_names,
            yticklabels=class_names
        )
        plt.title('Confusion Matrix')
        plt.xlabel('Predicted')
        plt.ylabel('Actual')

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

    def visualize_feature_maps(self, image: np.ndarray,
                             layer_names: List[str],
                             save_path: Optional[str] = None):
        """Visualize feature maps from specified layers"""

        # Create model that outputs feature maps
        layer_outputs = [self.model.get_layer(name).output for name in layer_names]
        visualization_model = tf.keras.Model(
            inputs=self.model.input,
            outputs=layer_outputs
        )

        # Get feature maps
        feature_maps = visualization_model.predict(np.expand_dims(image, axis=0))

        # Plot feature maps
        fig, axes = plt.subplots(len(layer_names), 8, figsize=(20, len(layer_names) * 3))

        for layer_idx, feature_map in enumerate(feature_maps):
            for i in range(min(8, feature_map.shape[-1])):
                ax = axes[layer_idx, i] if len(layer_names) > 1 else axes[i]
                ax.imshow(feature_map[0, :, :, i], cmap='viridis')
                ax.set_title(f'{layer_names[layer_idx]} - Filter {i}')
                ax.axis('off')

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

    def generate_class_activation_maps(self, image: np.ndarray,
                                     class_index: int,
                                     save_path: Optional[str] = None):
        """Generate Class Activation Maps (CAM)"""

        # Get the last convolutional layer
        last_conv_layer = None
        for layer in reversed(self.model.layers):
            if isinstance(layer, layers.Conv2D):
                last_conv_layer = layer
                break

        if last_conv_layer is None:
            logger.error("No convolutional layer found for CAM generation")
            return

        # Create model for gradient calculation
        grad_model = tf.keras.Model(
            inputs=self.model.inputs,
            outputs=[last_conv_layer.output, self.model.output]
        )

        # Calculate gradients
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(np.expand_dims(image, axis=0))
            loss = predictions[:, class_index]

        # Get gradients of the loss w.r.t. the conv layer
        grads = tape.gradient(loss, conv_outputs)

        # Pool gradients over spatial dimensions
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        # Weight feature maps by gradients
        conv_outputs = conv_outputs[0]
        for i in range(pooled_grads.shape[-1]):
            conv_outputs = conv_outputs[:, :, i] * pooled_grads[i]

        # Create heatmap
        heatmap = tf.reduce_mean(conv_outputs, axis=-1)
        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)

        # Resize heatmap to image size
        heatmap = tf.image.resize(
            tf.expand_dims(heatmap, axis=-1),
            (image.shape[0], image.shape[1])
        )
        heatmap = tf.squeeze(heatmap)

        # Plot results
        fig, axes = plt.subplots(1, 3, figsize=(15, 5))

        # Original image
        axes[0].imshow(image)
        axes[0].set_title('Original Image')
        axes[0].axis('off')

        # Heatmap
        axes[1].imshow(heatmap, cmap='hot')
        axes[1].set_title('Class Activation Map')
        axes[1].axis('off')

        # Overlay
        axes[2].imshow(image)
        axes[2].imshow(heatmap, alpha=0.6, cmap='hot')
        axes[2].set_title('Overlay')
        axes[2].axis('off')

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

# Example usage
analyzer = ModelAnalyzer(model)

# Plot model architecture
analyzer.plot_model_architecture()

# Analyze predictions
class_names = ['cat', 'dog', 'bird', 'fish', 'horse', 'deer', 'frog', 'ship', 'car', 'plane']
analysis = analyzer.analyze_predictions(test_dataset, class_names)

# Plot confusion matrix
analyzer.plot_confusion_matrix(analysis['confusion_matrix'], class_names)

# Visualize feature maps
sample_image = next(iter(test_dataset.take(1)))[0][0].numpy()
analyzer.visualize_feature_maps(sample_image, ['conv2d', 'conv2d_1', 'conv2d_2'])
\`\`\`

## 7. Model Deployment and Serving

### Model Saving and Loading
\`\`\`python
class ModelManager:
    """Model management for deployment"""

    @staticmethod
    def save_model(model: tf.keras.Model,
                  save_path: str,
                  format: str = 'tf') -> None:
        """Save model in specified format"""

        if format == 'tf':
            # TensorFlow SavedModel format
            model.save(save_path)
            logger.info(f"Model saved as TensorFlow SavedModel: {save_path}")

        elif format == 'h5':
            # HDF5 format
            model.save(f"{save_path}.h5")
            logger.info(f"Model saved as HDF5: {save_path}.h5")

        elif format == 'tflite':
            # TensorFlow Lite format for mobile/edge deployment
            converter = tf.lite.TFLiteConverter.from_keras_model(model)
            converter.optimizations = [tf.lite.Optimize.DEFAULT]
            tflite_model = converter.convert()

            with open(f"{save_path}.tflite", "wb") as f:
                f.write(tflite_model)
            logger.info(f"Model saved as TensorFlow Lite: {save_path}.tflite")

        elif format == 'onnx':
            # ONNX format for cross-platform deployment
            import tf2onnx

            spec = (tf.TensorSpec(model.input_shape, tf.float32, name="input"),)
            output_path = f"{save_path}.onnx"

            model_proto, _ = tf2onnx.convert.from_keras(model, input_signature=spec, opset=13)
            with open(output_path, "wb") as f:
                f.write(model_proto.SerializeToString())
            logger.info(f"Model saved as ONNX: {output_path}")

    @staticmethod
    def load_model(model_path: str) -> tf.keras.Model:
        """Load model from saved format"""

        if model_path.endswith('.h5'):
            model = tf.keras.models.load_model(model_path)
        elif model_path.endswith('.tflite'):
            # Load TFLite model
            interpreter = tf.lite.Interpreter(model_path=model_path)
            interpreter.allocate_tensors()
            return interpreter
        else:
            # Assume TensorFlow SavedModel format
            model = tf.keras.models.load_model(model_path)

        logger.info(f"Model loaded from: {model_path}")
        return model

    @staticmethod
    def create_inference_function(model: tf.keras.Model) -> callable:
        """Create optimized inference function"""

        @tf.function
        def inference_fn(input_data):
            return model(input_data, training=False)

        return inference_fn

    @staticmethod
    def benchmark_model(model: tf.keras.Model,
                       input_shape: Tuple[int, ...],
                       num_iterations: int = 100) -> Dict[str, float]:
        """Benchmark model inference performance"""

        # Create dummy input
        dummy_input = tf.random.normal((1,) + input_shape)

        # Warm up
        for _ in range(10):
            _ = model(dummy_input, training=False)

        # Benchmark
        start_time = time.time()
        for _ in range(num_iterations):
            _ = model(dummy_input, training=False)
        end_time = time.time()

        total_time = end_time - start_time
        avg_time = total_time / num_iterations
        throughput = num_iterations / total_time

        return {
            'total_time': total_time,
            'average_inference_time': avg_time,
            'throughput_fps': throughput
        }

# Flask API for model serving
from flask import Flask, request, jsonify
import base64
from PIL import Image
import io

class ModelAPI:
    """Flask API for serving TensorFlow models"""

    def __init__(self, model: tf.keras.Model, class_names: List[str]):
        self.model = model
        self.class_names = class_names
        self.app = Flask(__name__)
        self.setup_routes()

    def setup_routes(self):
        """Setup API routes"""

        @self.app.route('/predict', methods=['POST'])
        def predict():
            try:
                # Get image from request
                if 'image' not in request.json:
                    return jsonify({'error': 'No image provided'}), 400

                # Decode base64 image
                image_data = base64.b64decode(request.json['image'])
                image = Image.open(io.BytesIO(image_data))

                # Preprocess image
                image = image.resize((224, 224))
                image_array = np.array(image) / 255.0
                image_array = np.expand_dims(image_array, axis=0)

                # Make prediction
                predictions = self.model.predict(image_array)
                predicted_class = np.argmax(predictions[0])
                confidence = float(predictions[0][predicted_class])

                return jsonify({
                    'predicted_class': self.class_names[predicted_class],
                    'confidence': confidence,
                    'all_predictions': {
                        self.class_names[i]: float(predictions[0][i])
                        for i in range(len(self.class_names))
                    }
                })

            except Exception as e:
                return jsonify({'error': str(e)}), 500

        @self.app.route('/health', methods=['GET'])
        def health():
            return jsonify({'status': 'healthy'})

        @self.app.route('/model-info', methods=['GET'])
        def model_info():
            return jsonify({
                'model_name': self.model.name,
                'input_shape': list(self.model.input_shape),
                'output_shape': list(self.model.output_shape),
                'num_parameters': self.model.count_params(),
                'classes': self.class_names
            })

    def run(self, host='0.0.0.0', port=5000, debug=False):
        """Run the Flask API"""
        self.app.run(host=host, port=port, debug=debug)

# Example usage
model_manager = ModelManager()

# Save model in different formats
model_manager.save_model(model, 'my_model', format='tf')
model_manager.save_model(model, 'my_model', format='h5')
model_manager.save_model(model, 'my_model', format='tflite')

# Load model
loaded_model = model_manager.load_model('my_model')

# Benchmark model
benchmark_results = model_manager.benchmark_model(model, (32, 32, 3))
print(benchmark_results)

# Create and run API
class_names = ['cat', 'dog', 'bird', 'fish', 'horse', 'deer', 'frog', 'ship', 'car', 'plane']
api = ModelAPI(model, class_names)
# api.run(debug=True)  # Uncomment to run the API
\`\`\`

## Implementation Checklist

- [ ] Set up TensorFlow environment with GPU support
- [ ] Create data preprocessing and augmentation pipelines
- [ ] Design and implement neural network architectures
- [ ] Set up comprehensive training pipeline with callbacks
- [ ] Implement custom layers, losses, and metrics as needed
- [ ] Add model visualization and interpretation tools
- [ ] Create model evaluation and analysis framework
- [ ] Implement model saving and loading functionality
- [ ] Set up model serving API for deployment
- [ ] Add performance benchmarking and monitoring
- [ ] Configure TensorBoard for experiment tracking
- [ ] Implement automated hyperparameter tuning
- [ ] Set up model versioning and registry
- [ ] Add comprehensive testing for all components

This comprehensive guide provides the foundation for building production-ready machine learning applications with TensorFlow, covering everything from basic setup to advanced deployment strategies and model interpretation techniques.`,
};
