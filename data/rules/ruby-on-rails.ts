import { Rule } from "../types";

export const rule: Rule = {
	id: "ruby-on-rails",
	slug: "ruby-on-rails",
	name: "Ruby on Rails",
	description: "Best practices for Ruby on Rails development",
	tags: ["ruby", "rails", "mvc", "activerecord", "orm"],
	votes: { up: 0, down: 0 },
	featured: false,
	createdAt: "2024-01-01",
	content: `# Ruby on Rails Development Best Practices

## 1. Rails Application Structure

Follow Rails conventions for directory structure and file organization.

\`\`\`ruby
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  def index
    @users = User.includes(:posts).page(params[:page])
  end

  def show
  end

  def create
    @user = User.new(user_params)

    if @user.save
      redirect_to @user, notice: 'User was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :avatar)
  end
end
\`\`\`

## 2. ActiveRecord Models

Define associations, validations, and business logic in models.

\`\`\`ruby
# app/models/user.rb
class User < ApplicationRecord
  include Searchable

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_one_attached :avatar

  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  scope :active, -> { where(active: true) }
  scope :recent, -> { order(created_at: :desc) }

  def full_name
    "#{first_name} #{last_name}".strip
  end

  def posts_count
    posts.published.count
  end

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end
end
\`\`\`

## 3. Database Migrations

Write clear, reversible migrations with proper indexing.

\`\`\`ruby
# db/migrate/20240101000000_create_users.rb
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :first_name
      t.string :last_name
      t.boolean :active, default: true
      t.datetime :last_sign_in_at

      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, [:active, :created_at]
  end
end
\`\`\`

## 4. Form Objects and Service Objects

Extract complex business logic into dedicated classes.

\`\`\`ruby
# app/forms/user_registration_form.rb
class UserRegistrationForm
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :name, :string
  attribute :email, :string
  attribute :password, :string
  attribute :password_confirmation, :string

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 8 }
  validates :password_confirmation, presence: true
  validate :passwords_match

  def save
    return false unless valid?

    ActiveRecord::Base.transaction do
      user = User.create!(
        name: name,
        email: email,
        password: password
      )

      WelcomeEmailJob.perform_later(user)
      user
    end
  rescue ActiveRecord::RecordInvalid
    false
  end

  private

  def passwords_match
    errors.add(:password_confirmation, "doesn't match password") if password != password_confirmation
  end
end
\`\`\`

## 5. Background Jobs

Use Active Job for background processing with proper error handling.

\`\`\`ruby
# app/jobs/welcome_email_job.rb
class WelcomeEmailJob < ApplicationJob
  queue_as :default

  retry_on StandardError, wait: :exponentially_longer, attempts: 3
  discard_on ActiveJob::DeserializationError

  def perform(user)
    UserMailer.welcome_email(user).deliver_now
  end
end

# app/mailers/user_mailer.rb
class UserMailer < ApplicationMailer
  default from: 'noreply@example.com'

  def welcome_email(user)
    @user = user
    mail(to: @user.email, subject: 'Welcome to our platform!')
  end
end
\`\`\`

## 6. View Components and Partials

Create reusable view components for better organization.

\`\`\`erb
<!-- app/views/shared/_user_card.html.erb -->
<div class="user-card">
  <div class="user-avatar">
    <%= image_tag user.avatar.attached? ? user.avatar : 'default-avatar.png',
                  alt: user.name, class: 'avatar' %>
  </div>

  <div class="user-info">
    <h3><%= link_to user.name, user_path(user) %></h3>
    <p class="email"><%= user.email %></p>
    <p class="posts-count"><%= pluralize(user.posts_count, 'post') %></p>
  </div>
</div>

<!-- Usage in views -->
<%= render 'shared/user_card', user: @user %>
\`\`\`

## 7. API Controllers and Serialization

Build consistent JSON APIs with proper serialization.

\`\`\`ruby
# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApiController
      before_action :set_user, only: [:show, :update, :destroy]

      def index
        @users = User.includes(:posts).page(params[:page])
        render json: @users, each_serializer: UserSerializer
      end

      def show
        render json: @user, serializer: UserSerializer
      end

      def create
        @user = User.new(user_params)

        if @user.save
          render json: @user, serializer: UserSerializer, status: :created
        else
          render json: { errors: @user.errors }, status: :unprocessable_entity
        end
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.require(:user).permit(:name, :email)
      end
    end
  end
end

# app/serializers/user_serializer.rb
class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :created_at, :posts_count

  def posts_count
    object.posts.published.count
  end
end
\`\`\`

## 8. Testing with RSpec

Write comprehensive tests for models, controllers, and features.

\`\`\`ruby
# spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email) }
  end

  describe 'associations' do
    it { should have_many(:posts).dependent(:destroy) }
    it { should have_many(:comments).dependent(:destroy) }
  end

  describe '#full_name' do
    it 'returns the concatenated first and last name' do
      user = build(:user, first_name: 'John', last_name: 'Doe')
      expect(user.full_name).to eq('John Doe')
    end
  end
end

# spec/controllers/users_controller_spec.rb
require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  let(:user) { create(:user) }

  describe 'GET #index' do
    it 'returns a success response' do
      get :index
      expect(response).to be_successful
    end

    it 'assigns @users' do
      get :index
      expect(assigns(:users)).to eq([user])
    end
  end
end
\`\`\`

## 9. Rails Configuration and Environments

Configure different environments properly.

\`\`\`ruby
# config/environments/production.rb
Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?
  config.assets.compile = false
  config.active_storage.variant_processor = :mini_magick

  config.log_level = :info
  config.log_tags = [:request_id]

  config.action_mailer.perform_caching = false
  config.action_mailer.default_url_options = { host: ENV['HOST'] }

  config.active_record.dump_schema_after_migration = false
  config.active_job.queue_adapter = :sidekiq
end

# config/application.rb
module MyApp
  class Application < Rails::Application
    config.load_defaults 7.0

    config.time_zone = 'UTC'
    config.active_record.default_timezone = :utc

    config.generators do |g|
      g.test_framework :rspec
      g.factory_bot dir: 'spec/factories'
    end
  end
end
\`\`\`

## 10. Security Best Practices

Implement proper security measures and follow Rails security guidelines.

\`\`\`ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def authorize_admin!
    redirect_to root_path unless current_user&.admin?
  end
end

# Strong parameters example
def user_params
  params.require(:user).permit(:name, :email, posts_attributes: [:title, :content])
end

# SQL injection prevention
User.where("name = ?", params[:name])  # Good
User.where("name = '#{params[:name]}'")  # Bad - SQL injection risk
\`\`\`

## Checklist

- [ ] Follow Rails naming conventions and directory structure
- [ ] Use ActiveRecord validations and associations properly
- [ ] Write reversible database migrations with appropriate indexes
- [ ] Extract business logic into service objects and form objects
- [ ] Implement background jobs for time-consuming tasks
- [ ] Create reusable view components and partials
- [ ] Build consistent JSON APIs with proper serialization
- [ ] Write comprehensive tests for all application layers
- [ ] Configure environments properly for development, test, and production
- [ ] Follow Rails security best practices and use strong parameters
- [ ] Use Rails conventions for naming and file organization
- [ ] Implement proper error handling and logging
- [ ] Use Rails built-in helpers and avoid reinventing the wheel
- [ ] Keep dependencies updated and follow semantic versioning
- [ ] Use Rails caching mechanisms for performance optimization`,
};
