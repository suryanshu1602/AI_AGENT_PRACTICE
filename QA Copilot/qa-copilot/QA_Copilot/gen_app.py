import sys,os  
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  
if PROJECT_ROOT not in sys.path: sys.path.insert(0, PROJECT_ROOT)  
os.chdir(PROJECT_ROOT)  
import streamlit as st  
from src.llm.rag_chain import RAGChain  
st.set_page_config(page_title="QA Copilot", page_icon=":robot_face:", layout="wide")  
