from dataclasses import dataclass
from typing import List, Tuple, Optional
import numpy as np
from scipy.spatial.distance import pdist, squareform
from gudhi import SimplexTree

@dataclass
class TopologicalFeature:
    """Represents a topological feature with its persistence"""
    dimension: int
    birth: float
    death: float
    persistence: float

class VietorisRipsComplex:
    """Efficient implementation of Vietoris-Rips complex construction"""
    
    def __init__(self, epsilon: float = 1.0, max_dim: int = 2):
        self.epsilon = epsilon
        self.max_dim = max_dim
        self.complex: List[List[int]] = []
        
    def build_complex(self, points: np.ndarray) -> None:
        """Build Vietoris-Rips complex from point cloud"""
        distances = pdist(points)
        adjacency = squareform(distances) <= self.epsilon
        
        # Add vertices (0-simplices)
        for i in range(len(points)):
            self.complex.append([i])
            
        # Add edges (1-simplices)
        for i in range(len(points)):
            for j in range(i+1, len(points)):
                if adjacency[i,j]:
                    self.complex.append([i,j])
                    
        # Add higher-dimensional simplices
        for dim in range(2, self.max_dim + 1):
            self._add_higher_simplices(dim)
    
    def _add_higher_simplices(self, dim: int) -> None:
        """Add simplices of given dimension"""
        if dim == 2:
            for i in range(len(self.complex)):
                for j in range(i+1, len(self.complex)):
                    if self._can_form_triangle(self.complex[i], self.complex[j]):
                        self.complex.append(self.complex[i] + self.complex[j])
    
    def _can_form_triangle(self, simplex1: List[int], simplex2: List[int]) -> bool:
        """Check if two simplices can form a triangle"""
        common = set(simplex1) & set(simplex2)
        if len(common) < 2:
            return False
        return all(self.distances[i,j] <= self.epsilon 
                  for i in simplex1 + simplex2 
                  for j in simplex1 + simplex2 
                  if i < j)

class PersistentHomology:
    """Calculate persistence homology of a simplicial complex"""
    
    def __init__(self):
        self.diagrams: List[List[Tuple[float, float]]] = []
        
    def calculate_persistence(self, complex: List[List[int]]) -> List[List[Tuple[float, float]]]:
        """Calculate persistence diagram for complex"""
        st = SimplexTree()
        for simplex in complex:
            st.insert(simplex, 1.0)
        self.diagrams = st.persistence_homology()
        return self.diagrams
    
    def get_significant_features(self, threshold: float = 0.5) -> List[TopologicalFeature]:
        """Identify significant topological features"""
        significant = []
        for dim, diagram in enumerate(self.diagrams):
            for birth, death in diagram:
                if death - birth > threshold:
                    significant.append(TopologicalFeature(
                        dimension=dim,
                        birth=birth,
                        death=death,
                        persistence=death - birth
                    ))
        return significant

class FinancialTopologyAnalyzer:
    """Analyze financial data using topological methods"""
    
    def __init__(self, epsilon: float = 1.0, max_dim: int = 2):
        self.vr = VietorisRipsComplex(epsilon, max_dim)
        self.ph = PersistentHomology()
        
    def analyze_market_data(self, prices: np.ndarray) -> List[TopologicalFeature]:
        """Analyze market data using topological methods"""
        points = self._create_point_cloud(prices)
        self.vr.build_complex(points)
        self.ph.calculate_persistence(self.vr.complex)
        return self.ph.get_significant_features()
    
    def _create_point_cloud(self, prices: np.ndarray) -> np.ndarray:
        """Convert price series to point cloud"""
        windows = []
        for i in range(len(prices)-self.vr.max_dim):
            window = prices[i:i+self.vr.max_dim]
            normalized = (window - window.mean()) / window.std()
            windows.append(normalized)
        return np.array(windows)
