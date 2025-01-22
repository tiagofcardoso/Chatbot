import pytest
from unittest.mock import patch, MagicMock
from src.bot.services import (
    get_bot_response, 
    load_documents_from_url, 
    load_documents_from_pdf,
    process_user_input
)

def test_load_documents_from_url():
    with patch('src.bot.services.WebBaseLoader') as mock_loader:
        # Setup mock
        mock_doc = MagicMock()
        mock_doc.page_content = "Test content"
        mock_loader.return_value.load.return_value = [mock_doc]
        
        # Test valid URL
        result = load_documents_from_url("https://example.com")
        assert result == "Test content"
        
        # Test URL without scheme
        result = load_documents_from_url("example.com")
        mock_loader.assert_called_with("https://example.com")

def test_get_bot_response():
    with patch('src.bot.services.ChatGroq') as mock_chat:
        mock_chat.return_value.invoke.return_value.content = "Bot response"
        messages = [("human", "test message")]
        document = "test document"
        
        result = get_bot_response(messages, document)
        assert result == "Bot response"

def test_process_user_input():
    with patch('src.bot.services.get_bot_response') as mock_get_response:
        mock_get_response.return_value = "Test response"
        result = process_user_input("test input")
        assert result == "Test response"