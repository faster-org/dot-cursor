import { Rule } from "../types";

export const rule: Rule = {
	id: "machine-learning-python",
	slug: "machine-learning-python",
	title: "Machine Learning with Python and Scikit-Learn",
	tags: ["python", "machine-learning", "scikit-learn", "data-science", "ai"],
	languages: ["python"],
	description:
		"Build and deploy machine learning models using Python, scikit-learn, and best practices for ML development",
	
	categories: ["programming", "language"],content: `# Machine Learning with Python and Scikit-Learn

## 1. Project Setup and Environment

### Environment Configuration
\`\`\`python
# requirements.txt
numpy==1.24.3
pandas==2.0.3
scikit-learn==1.3.0
matplotlib==3.7.2
seaborn==0.12.2
jupyter==1.0.0
plotly==5.15.0
joblib==1.3.1
xgboost==1.7.6
lightgbm==4.0.0
optuna==3.2.0
mlflow==2.5.0
pytest==7.4.0
pytest-cov==4.1.0
black==23.7.0
flake8==6.0.0
mypy==1.4.1
\`\`\`

### Project Structure
\`\`\`
ml-project/
├── data/
│   ├── raw/
│   ├── processed/
│   └── external/
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_feature_engineering.ipynb
│   └── 03_model_development.ipynb
├── src/
│   ├── __init__.py
│   ├── data/
│   │   ├── __init__.py
│   │   ├── data_loader.py
│   │   └── preprocessing.py
│   ├── features/
│   │   ├── __init__.py
│   │   ├── feature_engineering.py
│   │   └── feature_selection.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base_model.py
│   │   ├── classification.py
│   │   └── regression.py
│   ├── evaluation/
│   │   ├── __init__.py
│   │   └── metrics.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── tests/
├── models/
├── reports/
├── config/
│   └── config.yaml
├── requirements.txt
└── setup.py
\`\`\`

## 2. Data Processing and Feature Engineering

### Data Loading and Validation
\`\`\`python
# src/data/data_loader.py
import pandas as pd
import numpy as np
from typing import Tuple, Optional, Dict, Any
from pathlib import Path
import logging
from sklearn.model_selection import train_test_split

logger = logging.getLogger(__name__)

class DataLoader:
    """Handles data loading, validation, and initial preprocessing."""

    def __init__(self, data_path: str):
        self.data_path = Path(data_path)

    def load_data(self, filename: str) -> pd.DataFrame:
        """Load data from various file formats."""
        file_path = self.data_path / filename

        if not file_path.exists():
            raise FileNotFoundError(f"Data file not found: {file_path}")

        # Determine file type and load accordingly
        if file_path.suffix == '.csv':
            return pd.read_csv(file_path)
        elif file_path.suffix == '.json':
            return pd.read_json(file_path)
        elif file_path.suffix in ['.xlsx', '.xls']:
            return pd.read_excel(file_path)
        elif file_path.suffix == '.parquet':
            return pd.read_parquet(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_path.suffix}")

    def validate_data(self, df: pd.DataFrame, required_columns: list) -> bool:
        """Validate that the dataframe has required columns and basic structure."""
        missing_columns = set(required_columns) - set(df.columns)
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")

        if df.empty:
            raise ValueError("DataFrame is empty")

        logger.info(f"Data validation passed. Shape: {df.shape}")
        return True

    def split_data(
        self,
        df: pd.DataFrame,
        target_column: str,
        test_size: float = 0.2,
        val_size: float = 0.1,
        random_state: int = 42,
        stratify: bool = True
    ) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, pd.Series]:
        """Split data into train, validation, and test sets."""

        X = df.drop(columns=[target_column])
        y = df[target_column]

        stratify_param = y if stratify else None

        # First split: train+val vs test
        X_temp, X_test, y_temp, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=stratify_param
        )

        # Second split: train vs val
        val_ratio = val_size / (1 - test_size)
        stratify_param = y_temp if stratify else None

        X_train, X_val, y_train, y_val = train_test_split(
            X_temp, y_temp, test_size=val_ratio, random_state=random_state, stratify=stratify_param
        )

        logger.info(f"Data split - Train: {X_train.shape}, Val: {X_val.shape}, Test: {X_test.shape}")
        return X_train, X_val, X_test, y_train, y_val, y_test

# src/data/preprocessing.py
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder, OneHotEncoder
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import pandas as pd
import numpy as np

class DataPreprocessor:
    """Handles data preprocessing including scaling, encoding, and imputation."""

    def __init__(self):
        self.preprocessor = None
        self.target_encoder = None

    def build_preprocessor(
        self,
        numeric_features: list,
        categorical_features: list,
        numeric_strategy: str = 'standard',
        categorical_strategy: str = 'onehot',
        imputation_strategy: str = 'median'
    ) -> ColumnTransformer:
        """Build preprocessing pipeline."""

        # Numeric preprocessing
        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy=imputation_strategy)),
            ('scaler', StandardScaler() if numeric_strategy == 'standard' else MinMaxScaler())
        ])

        # Categorical preprocessing
        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ])

        # Combine transformers
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, numeric_features),
                ('cat', categorical_transformer, categorical_features)
            ]
        )

        return self.preprocessor

    def fit_transform(self, X: pd.DataFrame, y: pd.Series = None) -> np.ndarray:
        """Fit preprocessor and transform data."""
        if self.preprocessor is None:
            raise ValueError("Preprocessor not built. Call build_preprocessor first.")

        X_transformed = self.preprocessor.fit_transform(X)

        # Handle target encoding if needed
        if y is not None and y.dtype == 'object':
            self.target_encoder = LabelEncoder()
            y_encoded = self.target_encoder.fit_transform(y)
            return X_transformed, y_encoded

        return X_transformed, y

    def transform(self, X: pd.DataFrame, y: pd.Series = None) -> np.ndarray:
        """Transform new data using fitted preprocessor."""
        if self.preprocessor is None:
            raise ValueError("Preprocessor not fitted.")

        X_transformed = self.preprocessor.transform(X)

        if y is not None and self.target_encoder is not None:
            y_encoded = self.target_encoder.transform(y)
            return X_transformed, y_encoded

        return X_transformed, y
\`\`\`

### Feature Engineering
\`\`\`python
# src/features/feature_engineering.py
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from sklearn.preprocessing import PolynomialFeatures
from sklearn.feature_selection import SelectKBest, f_classif, f_regression, mutual_info_classif

class FeatureEngineer:
    """Advanced feature engineering operations."""

    def __init__(self):
        self.feature_selectors = {}

    def create_polynomial_features(
        self,
        X: pd.DataFrame,
        degree: int = 2,
        include_bias: bool = False
    ) -> pd.DataFrame:
        """Create polynomial features."""
        poly = PolynomialFeatures(degree=degree, include_bias=include_bias)
        X_poly = poly.fit_transform(X)

        # Create feature names
        feature_names = poly.get_feature_names_out(X.columns)
        return pd.DataFrame(X_poly, columns=feature_names, index=X.index)

    def create_interaction_features(self, X: pd.DataFrame, feature_pairs: List[tuple]) -> pd.DataFrame:
        """Create interaction features between specified feature pairs."""
        X_interactions = X.copy()

        for feature1, feature2 in feature_pairs:
            if feature1 in X.columns and feature2 in X.columns:
                interaction_name = f"{feature1}_x_{feature2}"
                X_interactions[interaction_name] = X[feature1] * X[feature2]

        return X_interactions

    def create_binned_features(
        self,
        X: pd.DataFrame,
        binning_config: Dict[str, Dict[str, Any]]
    ) -> pd.DataFrame:
        """Create binned versions of continuous features."""
        X_binned = X.copy()

        for feature, config in binning_config.items():
            if feature in X.columns:
                bins = config.get('bins', 5)
                labels = config.get('labels', None)

                X_binned[f"{feature}_binned"] = pd.cut(
                    X[feature],
                    bins=bins,
                    labels=labels,
                    include_lowest=True
                )

        return X_binned

    def create_lag_features(
        self,
        X: pd.DataFrame,
        time_column: str,
        feature_columns: List[str],
        lags: List[int]
    ) -> pd.DataFrame:
        """Create lag features for time series data."""
        X_lagged = X.copy()
        X_lagged = X_lagged.sort_values(by=time_column)

        for feature in feature_columns:
            for lag in lags:
                lag_feature_name = f"{feature}_lag_{lag}"
                X_lagged[lag_feature_name] = X_lagged[feature].shift(lag)

        return X_lagged.dropna()

    def select_features(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        method: str = 'mutual_info',
        k: int = 10
    ) -> List[str]:
        """Select top k features using specified method."""

        if method == 'mutual_info':
            selector = SelectKBest(score_func=mutual_info_classif, k=k)
        elif method == 'f_classif':
            selector = SelectKBest(score_func=f_classif, k=k)
        elif method == 'f_regression':
            selector = SelectKBest(score_func=f_regression, k=k)
        else:
            raise ValueError(f"Unknown feature selection method: {method}")

        X_selected = selector.fit_transform(X, y)
        selected_features = X.columns[selector.get_support()].tolist()

        self.feature_selectors[method] = selector
        return selected_features
\`\`\`

## 3. Model Development and Training

### Base Model Class
\`\`\`python
# src/models/base_model.py
from abc import ABC, abstractmethod
import joblib
import mlflow
import mlflow.sklearn
from typing import Dict, Any, Optional
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

class BaseModel(ABC):
    """Abstract base class for all models."""

    def __init__(self, model_name: str, **kwargs):
        self.model_name = model_name
        self.model = None
        self.is_fitted = False
        self.feature_names = None

    @abstractmethod
    def build_model(self, **kwargs):
        """Build the model architecture."""
        pass

    @abstractmethod
    def train(self, X_train, y_train, X_val=None, y_val=None, **kwargs):
        """Train the model."""
        pass

    def predict(self, X):
        """Make predictions."""
        if not self.is_fitted:
            raise ValueError("Model must be trained before making predictions")
        return self.model.predict(X)

    def predict_proba(self, X):
        """Get prediction probabilities (for classification models)."""
        if not self.is_fitted:
            raise ValueError("Model must be trained before making predictions")
        if hasattr(self.model, 'predict_proba'):
            return self.model.predict_proba(X)
        else:
            raise AttributeError("Model does not support probability predictions")

    def evaluate(self, X_test, y_test, task_type='classification') -> Dict[str, float]:
        """Evaluate model performance."""
        predictions = self.predict(X_test)

        if task_type == 'classification':
            metrics = {
                'accuracy': accuracy_score(y_test, predictions),
                'precision': precision_score(y_test, predictions, average='weighted'),
                'recall': recall_score(y_test, predictions, average='weighted'),
                'f1_score': f1_score(y_test, predictions, average='weighted')
            }
        else:  # regression
            metrics = {
                'mse': mean_squared_error(y_test, predictions),
                'mae': mean_absolute_error(y_test, predictions),
                'r2': r2_score(y_test, predictions),
                'rmse': np.sqrt(mean_squared_error(y_test, predictions))
            }

        return metrics

    def save_model(self, filepath: str):
        """Save the trained model."""
        if not self.is_fitted:
            raise ValueError("Cannot save unfitted model")
        joblib.dump(self.model, filepath)

    def load_model(self, filepath: str):
        """Load a trained model."""
        self.model = joblib.load(filepath)
        self.is_fitted = True

    def log_to_mlflow(self, metrics: Dict[str, float], params: Dict[str, Any]):
        """Log model metrics and parameters to MLflow."""
        with mlflow.start_run(run_name=self.model_name):
            mlflow.log_params(params)
            mlflow.log_metrics(metrics)
            mlflow.sklearn.log_model(self.model, "model")

# src/models/classification.py
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
import optuna

class ClassificationModel(BaseModel):
    """Classification model implementation."""

    def __init__(self, model_type: str = 'random_forest', **kwargs):
        super().__init__(f"{model_type}_classifier", **kwargs)
        self.model_type = model_type

    def build_model(self, **kwargs):
        """Build classification model based on type."""
        if self.model_type == 'random_forest':
            self.model = RandomForestClassifier(**kwargs)
        elif self.model_type == 'gradient_boosting':
            self.model = GradientBoostingClassifier(**kwargs)
        elif self.model_type == 'svm':
            self.model = SVC(**kwargs)
        elif self.model_type == 'logistic_regression':
            self.model = LogisticRegression(**kwargs)
        elif self.model_type == 'xgboost':
            self.model = XGBClassifier(**kwargs)
        elif self.model_type == 'lightgbm':
            self.model = LGBMClassifier(**kwargs)
        else:
            raise ValueError(f"Unknown model type: {self.model_type}")

    def train(self, X_train, y_train, X_val=None, y_val=None, **kwargs):
        """Train the classification model."""
        if self.model is None:
            self.build_model(**kwargs)

        # Special handling for models that support validation sets
        if self.model_type in ['xgboost', 'lightgbm'] and X_val is not None:
            eval_set = [(X_val, y_val)]
            self.model.fit(
                X_train, y_train,
                eval_set=eval_set,
                verbose=False,
                **kwargs
            )
        else:
            self.model.fit(X_train, y_train)

        self.is_fitted = True
        self.feature_names = X_train.columns if hasattr(X_train, 'columns') else None

    def optimize_hyperparameters(
        self,
        X_train, y_train,
        X_val, y_val,
        n_trials: int = 100
    ) -> Dict[str, Any]:
        """Optimize hyperparameters using Optuna."""

        def objective(trial):
            if self.model_type == 'random_forest':
                params = {
                    'n_estimators': trial.suggest_int('n_estimators', 10, 200),
                    'max_depth': trial.suggest_int('max_depth', 3, 20),
                    'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
                    'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10)
                }
            elif self.model_type == 'xgboost':
                params = {
                    'n_estimators': trial.suggest_int('n_estimators', 50, 300),
                    'max_depth': trial.suggest_int('max_depth', 3, 10),
                    'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                    'subsample': trial.suggest_float('subsample', 0.6, 1.0),
                    'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0)
                }
            else:
                # Add other model-specific parameter spaces
                params = {}

            self.build_model(**params)
            self.train(X_train, y_train)

            predictions = self.predict(X_val)
            accuracy = accuracy_score(y_val, predictions)

            return accuracy

        study = optuna.create_study(direction='maximize')
        study.optimize(objective, n_trials=n_trials)

        return study.best_params
\`\`\`

## 4. Model Evaluation and Validation

### Comprehensive Evaluation
\`\`\`python
# src/evaluation/metrics.py
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_curve, auc,
    precision_recall_curve, average_precision_score
)
from sklearn.model_selection import cross_val_score, learning_curve
import pandas as pd

class ModelEvaluator:
    """Comprehensive model evaluation and visualization."""

    def __init__(self, model, X_test, y_test, task_type='classification'):
        self.model = model
        self.X_test = X_test
        self.y_test = y_test
        self.task_type = task_type
        self.predictions = model.predict(X_test)

        if task_type == 'classification' and hasattr(model, 'predict_proba'):
            self.prediction_probs = model.predict_proba(X_test)

    def plot_confusion_matrix(self, normalize=False, figsize=(8, 6)):
        """Plot confusion matrix."""
        cm = confusion_matrix(self.y_test, self.predictions)

        if normalize:
            cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

        plt.figure(figsize=figsize)
        sns.heatmap(cm, annot=True, fmt='.2f' if normalize else 'd', cmap='Blues')
        plt.title('Confusion Matrix' + (' (Normalized)' if normalize else ''))
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.show()

    def plot_roc_curve(self, figsize=(8, 6)):
        """Plot ROC curve for binary classification."""
        if self.task_type != 'classification' or not hasattr(self, 'prediction_probs'):
            raise ValueError("ROC curve is only available for classification with probability predictions")

        # Handle binary vs multiclass
        if self.prediction_probs.shape[1] == 2:
            # Binary classification
            fpr, tpr, _ = roc_curve(self.y_test, self.prediction_probs[:, 1])
            roc_auc = auc(fpr, tpr)

            plt.figure(figsize=figsize)
            plt.plot(fpr, tpr, color='darkorange', lw=2,
                    label=f'ROC curve (AUC = {roc_auc:.2f})')
            plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
            plt.xlim([0.0, 1.0])
            plt.ylim([0.0, 1.05])
            plt.xlabel('False Positive Rate')
            plt.ylabel('True Positive Rate')
            plt.title('Receiver Operating Characteristic (ROC) Curve')
            plt.legend(loc="lower right")
            plt.show()
        else:
            # Multiclass classification
            from sklearn.preprocessing import label_binarize
            from sklearn.metrics import roc_curve, auc
            from itertools import cycle

            # Binarize the output
            y_test_bin = label_binarize(self.y_test, classes=np.unique(self.y_test))
            n_classes = y_test_bin.shape[1]

            # Compute ROC curve and ROC area for each class
            fpr = dict()
            tpr = dict()
            roc_auc = dict()

            for i in range(n_classes):
                fpr[i], tpr[i], _ = roc_curve(y_test_bin[:, i], self.prediction_probs[:, i])
                roc_auc[i] = auc(fpr[i], tpr[i])

            # Plot ROC curves
            plt.figure(figsize=figsize)
            colors = cycle(['aqua', 'darkorange', 'cornflowerblue', 'deeppink', 'green'])

            for i, color in zip(range(n_classes), colors):
                plt.plot(fpr[i], tpr[i], color=color, lw=2,
                        label=f'ROC curve class {i} (AUC = {roc_auc[i]:.2f})')

            plt.plot([0, 1], [0, 1], 'k--', lw=2)
            plt.xlim([0.0, 1.0])
            plt.ylim([0.0, 1.05])
            plt.xlabel('False Positive Rate')
            plt.ylabel('True Positive Rate')
            plt.title('Multi-class ROC Curves')
            plt.legend(loc="lower right")
            plt.show()

    def plot_precision_recall_curve(self, figsize=(8, 6)):
        """Plot Precision-Recall curve."""
        if self.task_type != 'classification' or not hasattr(self, 'prediction_probs'):
            raise ValueError("PR curve is only available for classification with probability predictions")

        precision, recall, _ = precision_recall_curve(
            self.y_test,
            self.prediction_probs[:, 1] if self.prediction_probs.shape[1] == 2 else self.prediction_probs.max(axis=1)
        )
        avg_precision = average_precision_score(self.y_test, self.predictions)

        plt.figure(figsize=figsize)
        plt.plot(recall, precision, color='darkorange', lw=2,
                label=f'Precision-Recall curve (AP = {avg_precision:.2f})')
        plt.xlabel('Recall')
        plt.ylabel('Precision')
        plt.title('Precision-Recall Curve')
        plt.legend(loc="lower left")
        plt.show()

    def plot_learning_curve(self, cv=5, figsize=(10, 6)):
        """Plot learning curve to analyze bias/variance."""
        train_sizes, train_scores, val_scores = learning_curve(
            self.model, self.X_test, self.y_test, cv=cv,
            train_sizes=np.linspace(0.1, 1.0, 10)
        )

        train_mean = np.mean(train_scores, axis=1)
        train_std = np.std(train_scores, axis=1)
        val_mean = np.mean(val_scores, axis=1)
        val_std = np.std(val_scores, axis=1)

        plt.figure(figsize=figsize)
        plt.plot(train_sizes, train_mean, 'o-', color='blue', label='Training score')
        plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.1, color='blue')

        plt.plot(train_sizes, val_mean, 'o-', color='red', label='Validation score')
        plt.fill_between(train_sizes, val_mean - val_std, val_mean + val_std, alpha=0.1, color='red')

        plt.xlabel('Training Set Size')
        plt.ylabel('Score')
        plt.title('Learning Curve')
        plt.legend(loc='best')
        plt.grid(True)
        plt.show()

    def feature_importance_analysis(self, feature_names=None, top_k=20):
        """Analyze and plot feature importance."""
        if not hasattr(self.model, 'feature_importances_'):
            print("Model does not support feature importance analysis")
            return

        importances = self.model.feature_importances_

        if feature_names is None:
            feature_names = [f'Feature_{i}' for i in range(len(importances))]

        # Create DataFrame for easier manipulation
        feature_imp_df = pd.DataFrame({
            'feature': feature_names,
            'importance': importances
        }).sort_values('importance', ascending=False)

        # Plot top k features
        top_features = feature_imp_df.head(top_k)

        plt.figure(figsize=(10, 8))
        sns.barplot(data=top_features, x='importance', y='feature')
        plt.title(f'Top {top_k} Feature Importances')
        plt.xlabel('Importance')
        plt.tight_layout()
        plt.show()

        return feature_imp_df

    def generate_classification_report(self):
        """Generate comprehensive classification report."""
        if self.task_type != 'classification':
            raise ValueError("Classification report is only available for classification tasks")

        report = classification_report(self.y_test, self.predictions, output_dict=True)
        report_df = pd.DataFrame(report).transpose()

        print("Classification Report:")
        print("=" * 50)
        print(classification_report(self.y_test, self.predictions))

        return report_df
\`\`\`

## 5. Model Deployment and MLOps

### Model Deployment Pipeline
\`\`\`python
# src/deployment/model_deployment.py
import mlflow
import mlflow.pyfunc
import pickle
import json
from typing import Dict, Any, Optional
import pandas as pd
import numpy as np
from pathlib import Path

class ModelDeployment:
    """Handle model deployment and serving."""

    def __init__(self, model_uri: str, model_name: str):
        self.model_uri = model_uri
        self.model_name = model_name
        self.model = None
        self.preprocessor = None

    def load_model(self):
        """Load model from MLflow registry."""
        self.model = mlflow.pyfunc.load_model(self.model_uri)
        print(f"Model {self.model_name} loaded successfully")

    def load_preprocessor(self, preprocessor_path: str):
        """Load preprocessing pipeline."""
        with open(preprocessor_path, 'rb') as f:
            self.preprocessor = pickle.load(f)
        print("Preprocessor loaded successfully")

    def predict_single(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Make prediction for a single sample."""
        # Convert input to DataFrame
        input_df = pd.DataFrame([input_data])

        # Preprocess if preprocessor is available
        if self.preprocessor:
            input_processed = self.preprocessor.transform(input_df)
        else:
            input_processed = input_df

        # Make prediction
        prediction = self.model.predict(input_processed)

        # Get prediction probability if available
        prediction_proba = None
        if hasattr(self.model, 'predict_proba'):
            prediction_proba = self.model.predict_proba(input_processed)[0].tolist()

        return {
            'prediction': prediction[0],
            'prediction_probability': prediction_proba,
            'model_name': self.model_name,
            'model_version': self.model_uri
        }

    def predict_batch(self, input_data: pd.DataFrame) -> pd.DataFrame:
        """Make predictions for a batch of samples."""
        # Preprocess if preprocessor is available
        if self.preprocessor:
            input_processed = self.preprocessor.transform(input_data)
        else:
            input_processed = input_data

        # Make predictions
        predictions = self.model.predict(input_processed)

        # Create results DataFrame
        results = input_data.copy()
        results['prediction'] = predictions

        # Add probabilities if available
        if hasattr(self.model, 'predict_proba'):
            prediction_probas = self.model.predict_proba(input_processed)
            for i in range(prediction_probas.shape[1]):
                results[f'probability_class_{i}'] = prediction_probas[:, i]

        return results

    def deploy_to_api(self, host: str = '0.0.0.0', port: int = 5000):
        """Deploy model as REST API using Flask."""
        from flask import Flask, request, jsonify

        app = Flask(__name__)

        @app.route('/predict', methods=['POST'])
        def predict():
            try:
                data = request.get_json()
                result = self.predict_single(data)
                return jsonify(result)
            except Exception as e:
                return jsonify({'error': str(e)}), 400

        @app.route('/predict_batch', methods=['POST'])
        def predict_batch():
            try:
                data = request.get_json()
                input_df = pd.DataFrame(data)
                results = self.predict_batch(input_df)
                return jsonify(results.to_dict('records'))
            except Exception as e:
                return jsonify({'error': str(e)}), 400

        @app.route('/health', methods=['GET'])
        def health():
            return jsonify({
                'status': 'healthy',
                'model_name': self.model_name,
                'model_uri': self.model_uri
            })

        print(f"Starting API server on {host}:{port}")
        app.run(host=host, port=port, debug=False)

# Model monitoring
class ModelMonitor:
    """Monitor model performance in production."""

    def __init__(self, model_name: str):
        self.model_name = model_name
        self.predictions_log = []

    def log_prediction(self, input_data: Dict, prediction: Any, actual: Optional[Any] = None):
        """Log prediction for monitoring."""
        log_entry = {
            'timestamp': pd.Timestamp.now(),
            'input_data': input_data,
            'prediction': prediction,
            'actual': actual
        }
        self.predictions_log.append(log_entry)

    def detect_data_drift(self, reference_data: pd.DataFrame, current_data: pd.DataFrame) -> Dict[str, float]:
        """Detect data drift using statistical tests."""
        from scipy.stats import ks_2samp

        drift_scores = {}

        for column in reference_data.columns:
            if reference_data[column].dtype in ['int64', 'float64']:
                # Kolmogorov-Smirnov test for numerical features
                statistic, p_value = ks_2samp(
                    reference_data[column].dropna(),
                    current_data[column].dropna()
                )
                drift_scores[column] = {
                    'test': 'KS',
                    'statistic': statistic,
                    'p_value': p_value,
                    'drift_detected': p_value < 0.05
                }

        return drift_scores

    def calculate_model_performance(self, predictions: list, actuals: list) -> Dict[str, float]:
        """Calculate current model performance metrics."""
        from sklearn.metrics import accuracy_score, f1_score

        metrics = {
            'accuracy': accuracy_score(actuals, predictions),
            'f1_score': f1_score(actuals, predictions, average='weighted'),
            'sample_count': len(predictions)
        }

        return metrics
\`\`\`

## Checklist for Machine Learning Development

- [ ] Set up proper project structure with data, notebooks, and source code
- [ ] Implement comprehensive data loading and validation
- [ ] Create robust preprocessing and feature engineering pipelines
- [ ] Build modular and reusable model classes
- [ ] Implement hyperparameter optimization
- [ ] Add comprehensive model evaluation and visualization
- [ ] Set up MLflow for experiment tracking
- [ ] Create model deployment pipeline
- [ ] Implement model monitoring and drift detection
- [ ] Add comprehensive unit and integration tests
- [ ] Document model assumptions and limitations
- [ ] Set up CI/CD for ML pipelines
- [ ] Implement data versioning and lineage tracking
- [ ] Add performance monitoring and alerting`,	applicationMode: "intelligent",

}